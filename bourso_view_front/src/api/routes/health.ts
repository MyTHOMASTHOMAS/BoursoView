/**
 * Route healthcheck — GET /
 * Déclaration des types et de la configuration de l'endpoint.
 * GET utilisé une seule fois : typage déclaré directement ici.
 */
import type { EndpointConfig } from 'MypkgReact/ReactQuery/ReactQueryBuilder'
import type { ApiErrorResponse, ApiResponse } from 'Shared/RouteType/Response/error'
import type { ResponseType } from 'Shared/RouteType/index'

type HealthMethods = { get: { data: ApiResponse<ResponseType.HealthResponse> } }

export type HealthMethodsConfig = EndpointConfig<HealthMethods, unknown, ApiErrorResponse>

export const health: HealthMethodsConfig = {
    key: 'health',
    path: '',
    endpointsOptions: {
        get: {},
    },
    queryOptions: {
        staleTime: undefined,
        gcTime: undefined,
        retry: false,
    },
}
