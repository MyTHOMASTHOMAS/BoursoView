/**
 * @file index.ts
 * @description Point d'entrée du module `financeHistory`.
 *
 * Réexporte uniquement les éléments destinés à être consommés en dehors du module.
 * Les fichiers internes (`cacheStore`, `fetchService`, `cacheResolver`, `dataExtractor`)
 * ne sont pas réexportés ici — ils sont des détails d'implémentation privés.
 */

export type {
    DateKey,
    OneDayData,
    TickerCache,
    FinanceHistoryCacheState,
    FinanceHistoryCacheActions,
    FinanceHistorySlice,
} from './types'
