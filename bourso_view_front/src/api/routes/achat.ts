/**
 * Routes achat — POST /?action=getAchats|createAchat|deleteAchat
 * Déclaration des types et de la configuration des endpoints.
 */
import type { ApiEndpointConfig } from '../api.config_utils.ts'
import { type ContextType, type ResponseType, Actions } from 'Shared/RouteType'

export type GetAchatsMethodsConfig = ApiEndpointConfig<
    ContextType.GetAchatsAction,
    ResponseType.GetAchatAction
>

export const getAchats: GetAchatsMethodsConfig = {
    key: 'getAchats',
    path: '',
    endpointsOptions: {
        post: {
            defaultQueryParams: { action: Actions.map.getAchatsAction },
            include_body_in_cache_key: true
        },
    },
    // Cache qui se rafraichie toutes les 5 min, mais garde le dernier cache si le nouveau fetch echoue
    queryOptions: {
        // 1. La donnée est considérée "fraîche" pendant 5 minutes.
        // Aucun refresh ne sera tenté avant ce délai.
        staleTime: 1000 * 60 * 5,

        // 2. On garde la donnée en mémoire tant que l'onglet est ouvert.
        // On met une valeur très élevée pour que le cache ne soit jamais vidé
        // par le garbage collector pendant la session.
        gcTime: Infinity,

        // 3. Comportement par défaut de TanStack Query :
        // Si le rafraîchissement échoue, il garde la dernière donnée valide (data).
        retry: 3,
    }
}

export type CreateAchatMethodsConfig = ApiEndpointConfig<
    ContextType.CreateAchatAction,
    ResponseType.CreateAchatAction
>

export const createAchat: CreateAchatMethodsConfig = {
    key: 'createAchat',
    path: '',
    endpointsOptions: {
        post: {
            defaultQueryParams: { action: Actions.map.createAchatAction }
        },
    },
}

export type DeleteAchatMethodsConfig = ApiEndpointConfig<
    ContextType.DeleteAchatAction,
    ResponseType.DeleteAchatAction
>

export const deleteAchat: DeleteAchatMethodsConfig = {
    key: 'deleteAchat',
    path: '',
    endpointsOptions: {
        post: {
            defaultQueryParams: { action: Actions.map.deleteAchatAction }
        },
    },
}
