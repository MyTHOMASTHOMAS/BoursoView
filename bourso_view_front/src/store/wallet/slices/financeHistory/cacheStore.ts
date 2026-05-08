/**
 * @file cacheStore.ts
 * @description Utilitaires purs de manipulation du cache `financeHistory`.
 *
 * Ce fichier ne contient **aucune dépendance React ni Zustand** — toutes les fonctions
 * sont des transformations de données pures, testables unitairement sans environment DOM.
 */

import type { ResponseType as RT } from 'Shared/RouteType'
import { DateSequenceManager } from 'MypkgTypescript/SequenceManager/index'
import type { DateKey, OneDayData, TickerCache } from './types'

// ─── Initialisation ───────────────────────────────────────────────────────────

/**
 * Crée un {@link TickerCache} vide — aucune donnée, aucune séquence chargée.
 *
 * @returns Un `TickerCache` initialisé avec une Map vide et un {@link DateSequenceManager} vide.
 */
export function createEmptyTickerCache(): TickerCache {
    return {
        data: new Map<DateKey, OneDayData>(),
        manager: new DateSequenceManager([]),
    }
}

// ─── Décomposition ───────────────────────────────────────────────────────────

/**
 * Décompose un {@link RT.TickerData} (arrays parallèles retournés par l'API) en une
 * `Map<DateKey, OneDayData>` indexée par date ISO.
 *
 * Les indices des arrays sont supposés cohérents : `date[i]` correspond à `open[i]`, etc.
 * Les entrées dont la date est manquante ou vide sont ignorées silencieusement.
 *
 * @param raw - Données brutes retournées par le backend pour un ticker.
 * @returns Map de données journalières prête à être fusionnée dans le cache.
 *
 * @example
 * const map = decomposeTickerData({ date: ['2024-01-02'], open: [100], high: [110], low: [99], close: [105], volume: [5000] })
 * // map.get('2024-01-02') → { open: 100, high: 110, low: 99, close: 105, volume: 5000 }
 */
export function decomposeTickerData(raw: RT.TickerData): Map<DateKey, OneDayData> {
    const result = new Map<DateKey, OneDayData>()

    const { date, open, high, low, close, volume } = raw

    for (let i = 0; i < date.length; i++) {
        const dateKey = date[i]
        if (!dateKey) continue

        result.set(dateKey, {
            open:   open[i]   ?? 0,
            high:   high[i]   ?? 0,
            low:    low[i]    ?? 0,
            close:  close[i]  ?? 0,
            volume: volume[i] ?? 0,
        })
    }

    return result
}

// ─── Fusion ───────────────────────────────────────────────────────────────────

/**
 * Fusionne des données entrantes dans un cache existant.
 *
 * Les clés déjà présentes sont **écrasées** par les nouvelles valeurs (les données fraîches
 * de l'API ont priorité, ex: corrections de données historiques).
 *
 * @param existing - Cache existant à enrichir (muté directement pour éviter la copie complète).
 * @param incoming - Nouvelles données journalières à intégrer.
 * @returns La même Map `existing`, enrichie des nouvelles entrées.
 *
 * @remarks
 * La mutation directe est intentionnelle : le slice Zustand est responsable de créer
 * un nouvel objet Map au niveau supérieur pour déclencher le re-render.
 */
export function mergeDataIntoCache(
    existing: Map<DateKey, OneDayData>,
    incoming: Map<DateKey, OneDayData>
): Map<DateKey, OneDayData> {
    for (const [key, value] of incoming) {
        existing.set(key, value)
    }
    return existing
}
