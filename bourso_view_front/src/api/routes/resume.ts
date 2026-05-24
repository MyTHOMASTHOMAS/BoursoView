/**
 * Route getResume — POST /?action=getResume
 * Retourne le résumé portefeuille (feuille Resume) avec cache React Query.
 */
import type { ApiEndpointConfig } from '../api.config_utils.ts'
import { type ContextType, type ResponseType, Actions } from 'Shared/RouteType'

export type GetResumeMethodsConfig = ApiEndpointConfig<
    ContextType.GetResumeAction,
    ResponseType.GetResumeAction
>

export const getResume: GetResumeMethodsConfig = {
    key: 'getResume',
    path: '',
    endpointsOptions: {
        post: {
            defaultQueryParams: { action: Actions.map.getResumeAction },
            include_body_in_cache_key: true,
        },
    },
    queryOptions: {
        staleTime: 1000 * 60 * 5,
        gcTime: Infinity,
        retry: 3,
    },
}
