/**
 * @file FinanceHistoryService.ts
 * @description Service de "Cache Intelligent" pour les données historiques d'indices.
 *
 * Architecture :
 *  1. Vérifie le cache React Query pour chaque ticker demandé
 *  2. Retour immédiat si tout est en cache (0 requête réseau)
 *  3. Si des tickers manquent → appel réseau groupé via ApiClient (hors React)
 *  4. Injecte chaque ticker dans son cache individuel via setData.get()
 *     → tous les composants qui écoutent ce ticker se mettent à jour automatiquement
 *
 * Note : On utilise api.client directement (et non useMutation) car ce service
 * est une fonction async normale, pas un hook React.
 */
import { api } from '../../api/api'
import type { ContextType, ResponseType } from 'Shared/RouteType'
import { Actions } from 'Shared/RouteType'

export type FetchHistoryParams = {
    indices: string[]
    startDate: string
    endDate: string
    period?: ContextType.HistoryPeriod
    authToken: string
}

export type FetchHistoryResult = Record<string, ResponseType.TickerData>

/**
 * Récupère les données historiques pour une liste de tickers.
 * - Utilise le cache React Query comme source de vérité locale.
 * - N'émet une requête réseau que pour les tickers absents du cache.
 * - Hydrate le cache après la réponse pour que les composants se mettent à jour.
 */
export async function fetchDynamicIndices({
    indices,
    startDate,
    endDate,
    period = 'DAILY',
    authToken,
}: FetchHistoryParams): Promise<FetchHistoryResult> {
    const missingIndices: string[] = []
    const finalResult: FetchHistoryResult = {}

    // ─── 1. Vérification du cache ────────────────────────────────────────────
    indices.forEach((ticker) => {
        const cachedData = api.financeHistory.getData.get({
            queryParams: { ticker, startDate, endDate, period },
        })

        if (cachedData) {
            console.log(`[FinanceService][Cache Hit] ${ticker}`)
            finalResult[ticker] = cachedData
        } else {
            console.log(`[FinanceService][Cache Miss] ${ticker}`)
            missingIndices.push(ticker)
        }
    })

    // ─── 2. Retour immédiat si tout est en cache ─────────────────────────────
    if (missingIndices.length === 0) {
        return finalResult
    }

    // ─── 3. Appel réseau groupé ────────────────────────────────────────────
    // On utilise ApiClient directement (hors composant React, donc pas de useMutation)
    console.log(`[FinanceService][Network] Fetching ${missingIndices.join(', ')}`)

    const body: ContextType.GetHistoryAction = {
        authToken,
        indices: missingIndices,
        start_date: startDate,
        end_date: endDate,
        period,
    }

    const queryParams = { action: Actions.map.getHistoryAction }

    // La réponse est ApiResponse<GetHistoryAction> = { success: true, data: Record<string, TickerData> }
    // ou { success: false, error: string }
    const apiResponse = await api.client.post<
        ResponseType.ApiResponse<ResponseType.GetHistoryAction> | ResponseType.ApiErrorResponse
    >('', body, queryParams)

    if (!apiResponse || !(apiResponse as any).success) {
        const errMsg = (apiResponse as any)?.error ?? 'Erreur inconnue du serveur'
        throw new Error(`[FinanceService] Erreur API : ${errMsg}`)
    }

    // Extraire le payload réel
    const apiData = (apiResponse as { success: true; data: ResponseType.GetHistoryAction }).data

    // ─── 4. Injection dans le cache individuel par ticker ────────────────────
    Object.entries(apiData).forEach(([ticker, tickerData]) => {
        // setData.get() écrit dans le cache de la clé `useQuery.get({ queryParams: { ticker, ... } })`
        // Tous les composants qui écoutent ce ticker reçoivent la donnée instantanément.
        api.financeHistory.setData.get(tickerData, {
            queryParams: { ticker, startDate, endDate, period },
        })

        console.log(`[FinanceService][Cache Set] ${ticker}`)
        finalResult[ticker] = tickerData
    })

    return finalResult
}
