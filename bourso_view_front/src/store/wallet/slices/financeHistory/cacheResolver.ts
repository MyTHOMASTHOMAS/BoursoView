/**
 * @file cacheResolver.ts
 * @description Orchestrateur principal du cache intelligent `financeHistory`.
 *
 * Contient la logique métier centrale :
 * 1. Identifier les intervalles manquants dans le cache via {@link DateSequenceManager}.
 * 2. Fetcher les segments manquants en **une seule requête** (batching).
 * 3. Injecter les données reçues dans le cache via `upsertCache`.
 *
 * Ce fichier est une fonction pure asynchrone — sans état, sans dépendance React.
 * Elle est appelée par le hook `useFinanceHistory` dans `financeHistorySlice.ts`.
 *
 * **Format de réponse API** :
 * L'API retourne un `TickerHistoryEntry[]` ordonné de la même façon que le tableau
 * `indices` de la requête. L'accès se fait donc par **index** (`apiData[i]`)
 * et non par clé ticker, ce qui garantit la cohérence même avec plusieurs segments
 * du même ticker.
 */

import type { Sequence } from 'MypkgTypescript/SequenceManager/index'
import type { DateKey, OneDayData, TickerCache } from './types'
import { decomposeTickerData } from './cacheStore'
import { fetchHistorySegments } from './fetchService'

// ─── Types ────────────────────────────────────────────────────────────────────

type ResolveRangeParams = {
    /** Symbole boursier à résoudre (ex: `"CAC:IND"`). */
    ticker: string
    /** Début de la plage demandée par le consommateur. */
    start: Date
    /** Fin de la plage demandée par le consommateur. */
    end: Date
    /** Token d'authentification utilisateur. */
    authToken: string
    /**
     * Retourne le {@link TickerCache} existant pour ce ticker.
     * Fourni par le slice Zustand via `getOrCreateTickerCache`.
     */
    getCache: (ticker: string) => TickerCache
    /**
     * Persiste de nouvelles données dans le cache Zustand et ajoute la séquence
     * au {@link DateSequenceManager} du ticker.
     * Fourni par le slice Zustand via `upsertCache`.
     */
    upsertCache: (
        ticker: string,
        sequence: Sequence<Date>,
        data: Map<DateKey, OneDayData>
    ) => void
}

// ─── Orchestrateur ────────────────────────────────────────────────────────────

/**
 * Résout une plage de dates pour un ticker donné en utilisant le cache intelligent.
 *
 * **Algorithme :**
 * 1. Récupère le `TickerCache` du ticker (ou en crée un vide).
 * 2. Calcule les intervalles manquants via `manager.getEmptySequences({ start, end })`.
 * 3. Si aucun trou → **retour immédiat**, aucun appel réseau.
 * 4. Sinon → **une seule requête batchée** pour tous les trous du même ticker.
 * 5. La réponse est un `TickerHistoryEntry[]` ordonné par index — accès par position.
 *
 * @remarks
 * - Les données absentes pour un gap (entrée vide) sont enregistrées quand même
 *   pour éviter des re-fetches indéfinis.
 * - Les weekends et jours fériés sont naturellement absents, ce n'est pas une erreur.
 *
 * @throws Propage l'erreur de {@link fetchHistorySegments} si la requête échoue.
 */
export async function resolveRange({
    ticker,
    start,
    end,
    authToken,
    getCache,
    upsertCache,
}: ResolveRangeParams): Promise<void> {
    const tickerCache = getCache(ticker)

    // ── Étape 1 : Calcul des trous dans le cache ──────────────────────────────
    const missingSequences = tickerCache.manager.getEmptySequences({ start, end })

    if (missingSequences.length === 0) {
        return
    }

    // ── Étape 2 : Requête batchée — un segment par gap ────────────────────────
    // L'ordre des segments dans la requête correspond exactement à l'ordre des
    // entrées dans la réponse : apiData[i] ↔ missingSequences[i]
    const segments = missingSequences.map((gap) => ({ ticker, sequence: gap }))
    const apiData = await fetchHistorySegments(segments, authToken)

    // ── Étape 3 : Intégration par index ───────────────────────────────────────
    for (let i = 0; i < missingSequences.length; i++) {
        const gap   = missingSequences[i]
        const entry = apiData[i]

        if (!gap) continue

        if (!entry || entry.data.date.length === 0) {
            // Segment absent ou vide — on enregistre quand même pour ne pas re-fetcher
            upsertCache(ticker, gap, new Map())
            continue
        }

        // Décompose les arrays parallèles en Map<DateKey, OneDayData>
        const decomposed = decomposeTickerData(entry.data)

        // Filtre uniquement les dates appartenant à ce gap
        const gapData = filterToGap(decomposed, gap)

        upsertCache(ticker, gap, gapData)
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Filtre une Map de données pour ne conserver que les entrées dans `[gap.start, gap.end]`.
 *
 * @param data - Données décomposées pour un segment.
 * @param gap  - Intervalle à extraire.
 */
function filterToGap(
    data: Map<DateKey, OneDayData>,
    gap: Sequence<Date>
): Map<DateKey, OneDayData> {
    const gapStartStr = formatDate(gap.start)
    const gapEndStr   = formatDate(gap.end)
    const result      = new Map<DateKey, OneDayData>()

    for (const [dateKey, dayData] of data) {
        if (dateKey >= gapStartStr && dateKey <= gapEndStr) {
            result.set(dateKey, dayData)
        }
    }

    return result
}

/**
 * Formate une `Date` en string `"YYYY-MM-DD"` pour la comparaison lexicographique ISO.
 */
function formatDate(date: Date): string {
    const y = date.getFullYear()
    const m = `${date.getMonth() + 1}`.padStart(2, '0')
    const d = `${date.getDate()}`.padStart(2, '0')
    return `${y}-${m}-${d}`
}
