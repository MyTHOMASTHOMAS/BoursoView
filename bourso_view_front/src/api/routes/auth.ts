/**
 * Route auth — POST /?action=auth
 * Déclaration des types et de la configuration de l'endpoint.
 */
import type { ApiEndpointConfig } from '../api.config_utils.ts'
import { type ContextType, type ResponseType, Actions } from 'Shared/RouteType'

export type AuthMethodsConfig = ApiEndpointConfig<ContextType.AuthAction, ResponseType.AuthAction>

export const auth: AuthMethodsConfig = {
    key: 'auth',
    path: '',
    endpointsOptions: {
        post: {
            defaultQueryParams: {action: Actions.map.authAction}
        },
    },
}
