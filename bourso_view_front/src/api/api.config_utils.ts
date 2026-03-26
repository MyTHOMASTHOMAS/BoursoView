/**
 * Types de configuration des endpoints API.
 * Basés sur {@link EndpointConfig} (ReactQueryBuilder) pour rester alignés avec createApi.
 * Les réponses sont typées avec {@link ApiResponse} (succès | {@link ApiErrorResponse}).
 */
import type { EndpointConfig } from 'MypkgReact/ReactQuery/ReactQueryBuilder'
import type { ResponseType as RT } from 'Shared/RouteType'

/** Spécification des méthodes pour un endpoint POST (body + data). Réponse : ApiResponse<TData>. */
type ApiEndpointMethods<TBody, TData> = {
    post: { body: TBody & { authToken: string }; data: RT.ApiResponse<TData> }
}

/** Configuration d'un endpoint POST (body + data typés côté client). Erreur API : ApiErrorResponse. */
export type ApiEndpointConfig<TBody, TData> = EndpointConfig<
    ApiEndpointMethods<TBody, TData>
>
