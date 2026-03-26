/**
 * Route getReferentiel — POST /?action=getReferentiel
 * Retourne la liste des referentiels avec cache React Query.
 */
import type {ApiEndpointConfig} from '../api.config_utils.ts'
import {type ContextType, type ResponseType, Actions} from 'Shared/RouteType'

export type ReferentielMethodsConfig = ApiEndpointConfig<
    ContextType.GetReferentielAction,
    ResponseType.GetReferentielAction
>

export const referentiel: ReferentielMethodsConfig = {
    key: 'referentiel',
    path: '',
    endpointsOptions: {
        post: {
            defaultQueryParams: {action: Actions.map.getReferentielAction},
            // Necessaire pour que le cache POST distingue les payloads (ex: authToken)
            include_body_in_cache_key: true
        }
    },
    // Cache qui se rafraichie toute les 5 min, mais garde le dernier cache si le nouveau fetch echoue
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
