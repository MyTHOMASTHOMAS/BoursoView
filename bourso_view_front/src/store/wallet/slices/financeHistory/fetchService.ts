/**
 * @file fetchService.ts
 * @description Couche réseau isolée pour la récupération des données historiques.
 *
 * Responsabilité unique : construire le body de la requête et appeler `api.client.post`.
 * Aucune logique de cache, aucune dépendance React.
 *
 * La route `history` retourne désormais un **tableau** `TickerHistoryEntry[]`
 * (et non plus un `Record<string, TickerData>`), ce qui permet d'avoir plusieurs
 * entrées distinctes pour le même ticker sur des plages différentes.
 *
 * **Déduplication des requêtes en vol** :
 * Un registre `pendingRequests` garantit que deux appels simultanés avec les mêmes
 * segments partagent la même `Promise` — aucun doublon HTTP.
 * Cela corrige notamment le comportement de React 18 `StrictMode` en développement.
 */

import { Actions, type ContextType, type ResponseType } from 'Shared/RouteType'
import { api } from '../../../../api/api'
import type { Sequence } from 'MypkgTypescript/SequenceManager/index'

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Paramètres pour fetcher un unique segment (ticker + intervalle de dates).
 */
export type FetchSegment = {
    ticker: string
    sequence: Sequence<Date>
}

// ─── Déduplication ────────────────────────────────────────────────────────────

/**
 * Registre des requêtes en cours, indexé par clé de segments.
 * Permet de partager la même `Promise` entre deux appels simultanés identiques.
 * @internal
 */
const pendingRequests = new Map<string, Promise<ResponseType.GetHistoryAction>>()

/**
 * Construit une clé unique pour un ensemble de segments.
 * Format : `"ticker:YYYY-MM-DD/YYYY-MM-DD,..."` — stable et déterministe.
 * @internal
 */
function buildRequestKey(segments: FetchSegment[]): string {
    return segments
        .map(({ ticker, sequence }) =>
            `${ticker}:${formatDate(sequence.start)}/${formatDate(sequence.end)}`
        )
        .join(',')
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Formate une `Date` en string `"YYYY-MM-DD"`.
 */
function formatDate(date: Date): string {
    const y = date.getFullYear()
    const m = `${date.getMonth() + 1}`.padStart(2, '0')
    const d = `${date.getDate()}`.padStart(2, '0')
    return `${y}-${m}-${d}`
}

// ─── Service ─────────────────────────────────────────────────────────────────

/**
 * Récupère les données historiques pour **un ou plusieurs segments** en une seule requête.
 *
 * Retourne un `TickerHistoryEntry[]` — chaque entrée correspond à un segment demandé,
 * ce qui permet d'avoir le même ticker plusieurs fois avec des plages différentes.
 *
 * Les appels simultanés avec les mêmes segments sont **dédupliqués**.
 *
 * @param segments  - Segments (ticker + intervalle) à récupérer.
 * @param authToken - Token d'authentification.
 * @returns Tableau `TickerHistoryEntry[]` retourné par l'API.
 * @throws {Error} Si la requête échoue ou si `success: false`.
 */
export async function fetchHistorySegments(
    segments: FetchSegment[],
    authToken: string
): Promise<ResponseType.GetHistoryAction> {
    const key = buildRequestKey(segments)

    // ── Déduplication : réutilise une requête en cours si elle existe ──────────
    const inflight = pendingRequests.get(key)
    if (inflight) return inflight

    // ── Nouvelle requête ──────────────────────────────────────────────────────
    const body: ContextType.GetHistoryAction = {
        authToken,
        indices: segments.map(({ ticker, sequence }) => ({
            ticker,
            start_date: formatDate(sequence.start),
            end_date:   formatDate(sequence.end),
            period:     'DAILY' as const,
        })),
    }

    const queryParams = { action: Actions.map.getHistoryAction }

    const request = api.client.post<
        ResponseType.ApiResponse<ResponseType.GetHistoryAction> | ResponseType.ApiErrorResponse
    >('', body, queryParams)
        .then((apiResponse) => {
            if (!apiResponse || !(apiResponse as { success?: boolean }).success) {
                const errMsg =
                    (apiResponse as { error?: string })?.error ??
                    'Erreur inconnue du serveur (getHistory)'
                throw new Error(errMsg)
            }
            return (apiResponse as { success: true; data: ResponseType.GetHistoryAction }).data
        })
        .finally(() => {
            pendingRequests.delete(key)
        })

    pendingRequests.set(key, request)
    return request
}
