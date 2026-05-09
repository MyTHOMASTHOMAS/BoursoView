/**
 * Routes fund — POST /?action=getFunds|createFund|deleteFund
 * Declaration des types et de la configuration des endpoints.
 */
import type { ApiEndpointConfig } from '../api.config_utils.ts'
import { type ContextType, type ResponseType, Actions } from 'Shared/RouteType'

export type GetFundsMethodsConfig = ApiEndpointConfig<
    ContextType.GetFundsAction,
    ResponseType.GetFundsAction
>

export const getFunds: GetFundsMethodsConfig = {
    key: 'getFunds',
    path: '',
    endpointsOptions: {
        post: {
            defaultQueryParams: { action: Actions.map.getFundsAction },
            include_body_in_cache_key: true
        },
    },
    queryOptions: {
        staleTime: 1000 * 60 * 5,
        gcTime: Infinity,
        retry: 3,
    }
}

export type CreateFundMethodsConfig = ApiEndpointConfig<
    ContextType.CreateFundAction,
    ResponseType.CreateFundAction
>

export const createFund: CreateFundMethodsConfig = {
    key: 'createFund',
    path: '',
    endpointsOptions: {
        post: {
            defaultQueryParams: { action: Actions.map.createFundAction }
        },
    },
}

export type DeleteFundMethodsConfig = ApiEndpointConfig<
    ContextType.DeleteFundAction,
    ResponseType.DeleteFundAction
>

export const deleteFund: DeleteFundMethodsConfig = {
    key: 'deleteFund',
    path: '',
    endpointsOptions: {
        post: {
            defaultQueryParams: { action: Actions.map.deleteFundAction }
        },
    },
}
