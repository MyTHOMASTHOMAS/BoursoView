import { createMiddlewareError, type ProcessContext } from "MypkgAppsScript/ProcessRouter";
import { getAuthToken } from "../../service/auth";

/**
 * Type pour le contexte d'authentification
 * Le middleware attend un token dans le body de la requête
 */
type AuthContext = {
    authToken: string;
};

/**
 * Type pour le résultat du middleware d'authentification
 * Ajoute des informations d'authentification au contexte
 */
type AuthMiddlewareResult = {
    authenticated: true;
    tokenValid: true;
};

/**
 * Middleware d'authentification réutilisable
 * 
 * Vérifie que le token fourni dans la requête correspond au token stocké dans la feuille Auth.
 * 
 * Utilisation :
 * ```typescript
 * const protectedRouteProcess = StartProcess<{ token: string; data: any }>()
 *     .do(authMiddleware)
 *     .do((ctx) => {
 *         // Le contexte contient maintenant authenticated: true et tokenValid: true
 *         // Logique de la route protégée
 *     })
 *     .result((ctx) => ({ ... }));
 * ```
 * 
 * @throws {MiddlewareError} Si le token est manquant ou invalide (code 401)
 */
export const authMiddleware = <TContext extends AuthContext>(
    ctx: ProcessContext<TContext>
): AuthMiddlewareResult => {
    // Récupérer le token attendu depuis la feuille Auth
    const expectedToken = getAuthToken();

    // Vérifier que le token correspond
    if (ctx.contents.authToken !== expectedToken) {
        throw createMiddlewareError("Token d'authentification invalide", {
            code: 401,
            message: "Le token fourni n'est pas valide"
        });
    }

    // Authentification réussie
    return {
        authenticated: true,
        tokenValid: true
    };
};
