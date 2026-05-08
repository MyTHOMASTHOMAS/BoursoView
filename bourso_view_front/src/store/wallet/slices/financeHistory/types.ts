/**
 * @file types.ts
 * @description Types partagés du module de cache intelligent `financeHistory`.
 *
 * Ce module centralise toutes les définitions de types utilisées par :
 * - `cacheStore.ts` — utilitaires de manipulation du cache
 * - `fetchService.ts` — couche réseau
 * - `cacheResolver.ts` — orchestrateur
 * - `dataExtractor.ts` — reconstruction des données
 * - `financeHistorySlice.ts` — slice Zustand + hook public
 */

import type { ResponseType as RT } from 'Shared/RouteType'
import type { DateSequenceManager, Sequence } from 'MypkgTypescript/SequenceManager/index'

// ─── Types de données brutes ──────────────────────────────────────────────────

/**
 * Clé d'un point de données dans le cache.
 * Format ISO `"YYYY-MM-DD"` — correspond à `TickerData.date[]` retourné par le backend.
 */
export type DateKey = string

/**
 * Données OHLCV pour un jour donné.
 * Correspond à une entrée dépliée de {@link RT.TickerData} (arrays parallèles → objet par jour).
 */
export type OneDayData = {
    open: number
    high: number
    low: number
    close: number
    volume: number
}

// ─── Structure du cache par ticker ───────────────────────────────────────────

/**
 * Cache pour un ticker donné.
 *
 * @property data    - Map `date ISO → données OHLCV` du jour. Les jours non-ouvrés sont absents.
 * @property manager - {@link DateSequenceManager} représentant les intervalles déjà chargés.
 *                     Permet de détecter efficacement les trous dans le cache.
 */
export type TickerCache = {
    data: Map<DateKey, OneDayData>
    manager: DateSequenceManager
}

// ─── État Zustand ─────────────────────────────────────────────────────────────

/** État persisté dans le slice Zustand — map `ticker → TickerCache`. */
export type FinanceHistoryCacheState = {
    /**
     * Cache global indexé par ticker.
     * Chaque entrée contient la map de données et le SequenceManager associé.
     */
    cache: Map<string, TickerCache>
}

/**
 * Actions du slice Zustand exposées en interne.
 * Les consommateurs React passent par le hook `useFinanceHistory`.
 */
export type FinanceHistoryCacheActions = {
    /**
     * Récupère le {@link TickerCache} existant pour un ticker,
     * ou crée et enregistre une entrée vide si absente.
     *
     * @param ticker - Symbole boursier (ex: `"CAC:IND"`).
     * @returns Le {@link TickerCache} du ticker (existant ou nouvellement créé).
     */
    getOrCreateTickerCache: (ticker: string) => TickerCache

    /**
     * Fusionne les nouvelles données dans le cache du ticker et enregistre la séquence
     * dans le {@link DateSequenceManager} associé.
     *
     * Déclenche un re-render Zustand en remplaçant la Map de cache.
     *
     * @param ticker   - Symbole boursier.
     * @param sequence - Intervalle de dates chargé (utilisé pour le {@link DateSequenceManager}).
     * @param data     - Nouvelles entrées journalières à fusionner dans le cache.
     */
    upsertCache: (
        ticker: string,
        sequence: Sequence<Date>,
        data: Map<DateKey, OneDayData>
    ) => void
}

/** Type complet du slice Zustand `financeHistory`. */
export type FinanceHistorySlice = FinanceHistoryCacheState & FinanceHistoryCacheActions
