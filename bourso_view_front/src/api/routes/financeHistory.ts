/**
 * Route financeHistory — POST /?action=getHistory
 *
 * Deux méthodes sur le même endpoint :
 *   - post : appel réseau groupé vers Apps Script ({indices[], start_date, end_date, period})
 *   - get  : espace de cache individuel par ticker (ne fait jamais d'appel réseau,
 *            enabled: false dans les composants consommateurs)
 *
 * L'astuce : le service FinanceHistoryService injecte les données dans le cache
 * via setData.get() après le POST groupé, ce qui déclenche automatiquement la
 * mise à jour de tous les composants qui écoutent ce ticker.
 */
import type { EndpointConfig } from 'MypkgReact/ReactQuery/ReactQueryBuilder'
import { type ContextType, type ResponseType, Actions } from 'Shared/RouteType'

// ---------------------------------------------------------------------------
// Types des méthodes
// ---------------------------------------------------------------------------

/**
 * Paramètres de query pour la méthode GET individuelle.
 * Chaque combinaison (ticker + dates + period) crée une clé de cache unique.
 */
export type FinanceHistoryGetQuery = {
    ticker: string
    startDate: string
    endDate: string
    period?: ContextType.HistoryPeriod
}

type FinanceHistoryMethods = {
    // Appel réseau groupé — body = contexte complet (indices[], dates, period, authToken)
    post: {
        body: ContextType.GetHistoryAction
        data: ResponseType.GetHistoryAction
    }
    // Cache individuel par ticker — data = données d'un seul ticker
    get: {
        query: FinanceHistoryGetQuery
        data: ResponseType.TickerData
    }
}

// ---------------------------------------------------------------------------
// Configuration de l'endpoint
// ---------------------------------------------------------------------------

export type FinanceHistoryEndpointConfig = EndpointConfig<FinanceHistoryMethods>

export const financeHistory: FinanceHistoryEndpointConfig = {
    key: 'financeHistory',
    path: '',
    endpointsOptions: {
        // POST groupé : ajoute le paramètre action + force le period par défaut
        post: {
            defaultQueryParams: { action: Actions.map.getHistoryAction },
            defaultBody: { period: 'DAILY' },
            include_body_in_cache_key: true,
        },
        // GET individuel : pas d'appel réseau (contrôlé par "enabled: false" côté composant)
        get: {},
    },
    // Cache très long : les données historiques ne changent pas en journée
    queryOptions: {
        staleTime: 1000 * 60 * 60 * 24, // 24h
        gcTime: Infinity,
        retry: 1,
    },
}
