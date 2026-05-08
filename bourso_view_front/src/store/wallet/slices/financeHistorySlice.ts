/**
 * @file financeHistorySlice.ts
 * @description Slice Zustand pour le cache intelligent des données historiques d'indices.
 *
 * Ce fichier expose :
 * - `createFinanceHistorySlice` — le `StateCreator` Zustand à composer dans `useWalletStore`.
 * - `useFinanceHistory`         — le hook public React pour les composants consommateurs.
 *
 * **Flux de données :**
 * ```
 * useFinanceHistory(ticker, start, end)
 *   → resolveRange(...)          ← calcule les trous via DateSequenceManager
 *   → fetchHistorySegments(...)  ← 1 requête batchée pour tous les gaps
 *   → upsertCache(...)           ← persiste dans Zustand
 *   → extractRangeFromCache(...) ← reconstruit les données depuis le cache
 * ```
 */

import type { StateCreator } from 'zustand'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Sequence } from 'MypkgTypescript/SequenceManager/index'
import type { ResponseType as RT } from 'Shared/RouteType'
import { useAppStore } from '../../useAppStore'
import type { WalletStore } from '../useWalletStore'
import { createEmptyTickerCache, mergeDataIntoCache } from './financeHistory/cacheStore'
import { resolveRange } from './financeHistory/cacheResolver'
import { extractRangeFromCache } from './financeHistory/dataExtractor'
import type { DateKey, FinanceHistorySlice, OneDayData, TickerCache } from './financeHistory/types'

export type { FinanceHistorySlice } from './financeHistory/types'

// ─── StateCreator Zustand ─────────────────────────────────────────────────────

/**
 * Slice Zustand pour le cache des données historiques.
 *
 * À composer dans `useWalletStore` avec les autres slices.
 * Les mutations de la Map déclenchent un re-render via la création d'un nouvel objet Map.
 */
export const createFinanceHistorySlice: StateCreator<
    WalletStore,
    [],
    [],
    FinanceHistorySlice
> = (set, get) => ({
    cache: new Map<string, TickerCache>(),

    // ── Getter / initialiseur ──────────────────────────────────────────────────

    getOrCreateTickerCache: (ticker: string): TickerCache => {
        const existing = get().cache.get(ticker)
        if (existing) return existing

        // Crée et enregistre immédiatement le cache vide pour éviter les conditions de course
        const empty = createEmptyTickerCache()
        set((state) => {
            const nextCache = new Map(state.cache)
            nextCache.set(ticker, empty)
            return { cache: nextCache }
        })
        return empty
    },

    // ── Upsert ────────────────────────────────────────────────────────────────

    upsertCache: (
        ticker: string,
        sequence: Sequence<Date>,
        data: Map<DateKey, OneDayData>
    ): void => {
        set((state) => {
            const nextCache = new Map(state.cache)

            // Récupère ou crée l'entrée du ticker
            const existing = nextCache.get(ticker) ?? createEmptyTickerCache()

            // Fusionne les nouvelles données journalières dans la Map existante
            const nextData = mergeDataIntoCache(new Map(existing.data), data)

            // Enregistre la séquence dans le DateSequenceManager
            // Note : add() est une mutation directe sur l'instance (SequenceManager est mutable)
            existing.manager.add(sequence)

            nextCache.set(ticker, {
                data:    nextData,
                manager: existing.manager,
            })

            return { cache: nextCache }
        })
    },
})

// ─── Hook public React ────────────────────────────────────────────────────────

/**
 * Résultat retourné par le hook {@link useFinanceHistory}.
 */
export type UseFinanceHistoryResult = {
    /** Données historiques pour le ticker sur la plage demandée, reconstruites depuis le cache. */
    tickerData: RT.TickerData
    /** `true` pendant la résolution d'un ou plusieurs gaps manquants. */
    loading: boolean
    /** Message d'erreur si la requête réseau a échoué, sinon `null`. */
    error: string | null
    /**
     * `true` si des données sont disponibles dans le cache pour la plage demandée
     * (au moins une entrée — les jours non-ouvrés sont ignorés).
     */
    hasData: boolean
}

/**
 * Hook React pour accéder aux données historiques d'un ticker avec cache intelligent.
 *
 * - Si les données sont déjà en cache : retour **immédiat** sans requête réseau.
 * - Si un trou est détecté : une **seule requête batchée** est émise pour tous les segments manquants.
 * - Les données sont **réactives** : tout changement de cache Zustand déclenche un re-render.
 *
 * @param ticker - Symbole boursier (ex: `"CAC:IND"`). Doit être non-vide pour activer le fetch.
 * @param start  - Début de la plage souhaitée (inclusive).
 * @param end    - Fin de la plage souhaitée (inclusive).
 * @returns {@link UseFinanceHistoryResult}
 *
 * @example
 * const { tickerData, loading, error, hasData } = useFinanceHistory(
 *   'CAC:IND',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * )
 */
export function useFinanceHistory(
    ticker: string,
    start: Date,
    end: Date
): UseFinanceHistoryResult {
    const token              = useAppStore((state) => state.token)
    const cache              = useWalletStoreCache()
    const getOrCreate        = useWalletStoreGetOrCreate()
    const upsertCache        = useWalletStoreUpsert()

    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState<string | null>(null)

    // Ref pour annuler les effets si le composant est démonté ou si les deps changent
    const cancelledRef = useRef(false)

    // Résolution du cache — déclenche un fetch uniquement si des gaps existent
    useEffect(() => {
        if (!ticker || !token) return

        cancelledRef.current = false
        setError(null)
        setLoading(true)

        void resolveRange({
            ticker,
            start,
            end,
            authToken: token,
            getCache:    getOrCreate,
            upsertCache,
        })
            .then(() => {
                if (cancelledRef.current) return
                setLoading(false)
            })
            .catch((err: unknown) => {
                if (cancelledRef.current) return
                setError(err instanceof Error ? err.message : 'Erreur réseau inconnue')
                setLoading(false)
            })

        return () => {
            cancelledRef.current = true
        }
        // start.getTime() / end.getTime() pour éviter les références instables
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticker, token, start.getTime(), end.getTime()])

    // Reconstruction réactive depuis le cache Zustand
    const tickerData = useMemo<RT.TickerData>(() => {
        const tickerCache = cache.get(ticker)
        if (!tickerCache) return emptyTickerData()
        return extractRangeFromCache(tickerCache.data, start, end)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cache, ticker, start.getTime(), end.getTime()])

    return {
        tickerData,
        loading,
        error,
        hasData: tickerData.date.length > 0,
    }
}

// ─── Sélecteurs Zustand isolés ────────────────────────────────────────────────
// Les sélecteurs sont extraits pour limiter le nombre de re-renders.

import { useWalletStore } from '../useWalletStore'

const useWalletStoreCache      = () => useWalletStore((s) => s.cache)
const useWalletStoreGetOrCreate = () => useWalletStore((s) => s.getOrCreateTickerCache)
const useWalletStoreUpsert     = () => useWalletStore((s) => s.upsertCache)

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Retourne un {@link RT.TickerData} vide (arrays vides) comme valeur par défaut. */
function emptyTickerData(): RT.TickerData {
    return { date: [], open: [], high: [], low: [], close: [], volume: [] }
}
