/**
 * Route getHistory — POST /?action=getHistory
 * Retourne les donnees historiques des indices avec cache React Query.
 */
import type { ApiEndpointConfig } from '../api.config_utils.ts'
import { type ContextType, type ResponseType, Actions } from 'Shared/RouteType'

export type HistoryMethodsConfig = ApiEndpointConfig<
    ContextType.GetHistoryAction,
    ResponseType.GetHistoryAction
>

export const history: HistoryMethodsConfig = {
    key: 'history',
    path: '',
    endpointsOptions: {
        post: {
            defaultQueryParams: { action: Actions.map.getHistoryAction },
            include_body_in_cache_key: true
        },
    },
    // Cache considere frais pendant 24h, mais garde le dernier cache si le nouveau fetch echoue
    queryOptions: {
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: Infinity,
        retry: 3,
    }
}
