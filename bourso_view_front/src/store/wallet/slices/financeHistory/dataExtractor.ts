/**
 * @file dataExtractor.ts
 * @description Reconstruction des données historiques depuis le cache Zustand.
 *
 * Ce fichier est responsable d'assembler un {@link RT.TickerData} (arrays parallèles)
 * à partir d'une `Map<DateKey, OneDayData>` en cache, pour une plage de dates donnée.
 *
 * Aucune dépendance React ni réseau — fonction pure et testable unitairement.
 */

import type { ResponseType as RT } from 'Shared/RouteType'
import type { DateKey, OneDayData } from './types'

// ─── Extracteur ───────────────────────────────────────────────────────────────

/**
 * Reconstruit un {@link RT.TickerData} depuis le cache pour une plage `[start, end]`.
 *
 * **Comportement :**
 * - Filtre les entrées de la Map dont la clé ISO `"YYYY-MM-DD"` est dans l'intervalle.
 * - Trie les entrées par date croissante (ordre lexicographique des ISO strings).
 * - Reconstruit les arrays parallèles `date[]`, `open[]`, `high[]`, `low[]`, `close[]`, `volume[]`.
 * - Les jours non-ouvrés (weekends, jours fériés) sont **naturellement absents** — aucun traitement spécial.
 *
 * @param cache - Map complète du cache pour un ticker (`Map<DateKey, OneDayData>`).
 * @param start - Début de la plage à extraire (inclusive).
 * @param end   - Fin de la plage à extraire (inclusive).
 * @returns {@link RT.TickerData} reconstruit avec des arrays parallèles triés par date.
 *          Retourne des arrays vides si aucune donnée n'est présente dans la plage.
 *
 * @example
 * const tickerData = extractRangeFromCache(cache, new Date('2024-01-01'), new Date('2024-03-31'))
 * // tickerData.date  → ['2024-01-02', '2024-01-03', ...]
 * // tickerData.close → [7500.5, 7480.2, ...]
 */
export function extractRangeFromCache(
    cache: Map<DateKey, OneDayData>,
    start: Date,
    end: Date
): RT.TickerData {
    const startStr = formatDate(start)
    const endStr   = formatDate(end)

    // Collecte et filtre les entrées dans la plage
    const entries: Array<[DateKey, OneDayData]> = []
    for (const [dateKey, dayData] of cache) {
        if (dateKey >= startStr && dateKey <= endStr) {
            entries.push([dateKey, dayData])
        }
    }

    // Tri par date croissante (lexicographique sur ISO = correct)
    entries.sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)

    // Reconstruction des arrays parallèles
    const date:   string[] = []
    const open:   number[] = []
    const high:   number[] = []
    const low:    number[] = []
    const close:  number[] = []
    const volume: number[] = []

    for (const [dateKey, dayData] of entries) {
        date.push(dateKey)
        open.push(dayData.open)
        high.push(dayData.high)
        low.push(dayData.low)
        close.push(dayData.close)
        volume.push(dayData.volume)
    }

    return { date, open, high, low, close, volume }
}

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Formate une `Date` en string `"YYYY-MM-DD"` pour la comparaison lexicographique des dates ISO.
 */
function formatDate(date: Date): string {
    const y = date.getFullYear()
    const m = `${date.getMonth() + 1}`.padStart(2, '0')
    const d = `${date.getDate()}`.padStart(2, '0')
    return `${y}-${m}-${d}`
}
