/**
 * Type générique pour la configuration d’un endpoint API (méthode POST).
 *
 * - Body : TBody auquel est ajouté `authToken` (injecté côté client).
 * - Réponse succès : `{ success: true, data: TData }`.
 * - Réponse erreur : {@link ResponseType.ApiErrorResponse}.
 */
export type ApiEndpointConfig<TBody, TData> = {
    post: {
        body: TBody & { authToken: string };
        data: TData;
    };
};
