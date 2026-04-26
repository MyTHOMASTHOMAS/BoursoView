/**
 * @file useHistoryStore.ts
 * @description Store Zustand autonome pour l'historique financier par ticker.
 *
 * Fonctionnement :
 * - Appelle `fetchHistory(['ticker1', 'ticker2'], ...)` pour lancer le chargement.
 * - Les tickers déjà en cache React Query sont retournés **immédiatement** (loading: false).
 * - Les tickers manquants passent en loading: true, puis sont mis à jour quand
 *   la réponse réseau arrive (un seul appel groupé pour tous les manquants).
 *
 * Retour de `tickers` :
 * {
 *   'ticker1': { data: TickerData, loading: false, error: null },
 *   'ticker2': { data: undefined,  loading: true,  error: null },
 * }
 */
import { create } from 'zustand'
import { api } from '../api/api'
import { fetchDynamicIndices } from '../features/financeHistory'
import type { ContextType, ResponseType } from 'Shared/RouteType'

// ─── Types ────────────────────────────────────────────────────────────────────

export type TickerState = {
    data: ResponseType.TickerData | undefined
    loading: boolean
    error: string | null
}

/** Clé composite qui identifie une entrée de cache (ticker + période) */
type TickerCacheKey = string

const makeCacheKey = (ticker: string, startDate: string, endDate: string, period: string): TickerCacheKey =>
    `${ticker}::${startDate}::${endDate}::${period}`

// ─── Interface du store ───────────────────────────────────────────────────────

interface HistoryStore {
    /**
     * Map de l'état par clé composite (ticker + dates + period).
     * Utilise `selectTickers()` pour accéder aux données de façon typée.
     */
    _entries: Record<TickerCacheKey, TickerState>

    /** @internal Met à jour un ou plusieurs état de ticker */
    _set: (key: TickerCacheKey, patch: Partial<TickerState>) => void

    /**
     * Charge les données pour une liste de tickers.
     * - Les tickers déjà en cache React Query sont disponibles immédiatement.
     * - Les tickers manquants sont mis en `loading: true` puis mis à jour à l'arrivée.
     * @param authToken - Token d'authentification
     */
    fetchHistory: (
        indices: string[],
        startDate: string,
        endDate: string,
        period: ContextType.HistoryPeriod,
        authToken: string
    ) => Promise<void>

    /**
     * Retourne l'état courant pour une liste de tickers.
     * Lecture du store Zustand — provoque un re-render si l'état change.
     */
    selectTickers: (
        indices: string[],
        startDate: string,
        endDate: string,
        period?: ContextType.HistoryPeriod
    ) => Record<string, TickerState>
}

// ─── Création du store ────────────────────────────────────────────────────────

export const useHistoryStore = create<HistoryStore>((set, get) => ({
    _entries: {},

    _set: (key, patch) =>
        set((state) => ({
            _entries: {
                ...state._entries,
                [key]: { ...(state._entries[key] ?? { data: undefined, loading: false, error: null }), ...patch },
            },
        })),

    fetchHistory: async (indices, startDate, endDate, period, authToken) => {
        const { _set } = get()
        const missingIndices: string[] = []

        // ── 1. Vérification du cache React Query ──────────────────────────────
        indices.forEach((ticker) => {
            const key = makeCacheKey(ticker, startDate, endDate, period)

            // Lecture cache React Query (hors React, 0 re-render)
            const cached = api.financeHistory.getData.get({
                queryParams: { ticker, startDate, endDate, period },
            })

            if (cached) {
                // Cache hit → disponible immédiatement dans le store
                _set(key, { data: cached, loading: false, error: null })
            } else {
                // Cache miss → on marque "en chargement" tout de suite
                _set(key, { data: undefined, loading: true, error: null })
                missingIndices.push(ticker)
            }
        })

        // ── 2. Rien à fetcher → on s'arrête ──────────────────────────────────
        if (missingIndices.length === 0) return

        // ── 3. Appel réseau groupé (un seul POST) ─────────────────────────────
        try {
            // fetchDynamicIndices gère l'appel réseau ET l'injection dans le cache RQ
            const result = await fetchDynamicIndices({
                indices: missingIndices,
                startDate,
                endDate,
                period,
                authToken,
            })

            // ── 4. Mise à jour du store Zustand par ticker ────────────────────
            Object.entries(result).forEach(([ticker, data]) => {
                const key = makeCacheKey(ticker, startDate, endDate, period)
                _set(key, { data, loading: false, error: null })
            })

            // Tickers demandés mais absents de la réponse → erreur spécifique
            missingIndices.forEach((ticker) => {
                if (!(ticker in result)) {
                    const key = makeCacheKey(ticker, startDate, endDate, period)
                    _set(key, { data: undefined, loading: false, error: 'Ticker non trouvé dans la réponse' })
                }
            })
        } catch (err: unknown) {
            // Erreur réseau → tous les tickers manquants passent en erreur
            const message = err instanceof Error ? err.message : 'Erreur réseau inconnue'
            missingIndices.forEach((ticker) => {
                const key = makeCacheKey(ticker, startDate, endDate, period)
                _set(key, { data: undefined, loading: false, error: message })
            })
        }
    },

    selectTickers: (indices, startDate, endDate, period = 'DAILY') => {
        const { _entries } = get()
        const result: Record<string, TickerState> = {}
        indices.forEach((ticker) => {
            const key = makeCacheKey(ticker, startDate, endDate, period)
            result[ticker] = _entries[key] ?? { data: undefined, loading: false, error: null }
        })
        return result
    },
}))

// ─── Hook utilitaire ──────────────────────────────────────────────────────────

/**
 * Raccourci pour lire l'état de plusieurs tickers en une ligne.
 *
 * @example
 * const states = useTickerStates(['INDEXEURO:PX1', 'INDEXSP:.INX'], '2023-01-01', '2024-01-01')
 * // { 'INDEXEURO:PX1': { data, loading, error }, 'INDEXSP:.INX': { ... } }
 */
export const useTickerStates = (
    indices: string[],
    startDate: string,
    endDate: string,
    period: ContextType.HistoryPeriod = 'DAILY'
): Record<string, TickerState> => {
    return useHistoryStore((s) => s.selectTickers(indices, startDate, endDate, period))
}
