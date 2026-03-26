/**
 * Type de réponse d’erreur renvoyée par l’API BoursoView (ProcessRouter).
 * Utilisée lorsque le backend retourne { success: false, ... }.
 */
export type ApiErrorResponse = {
    success: false;
    error: string;
    code?: number;
    errors?: Array<{ field?: string; message: string }>;
    message?: string;
};

/**
 * Réponse API complète : succès (data + success: true) ou erreur.
 */
export type ApiResponse<T> =
    | { success: true; data: T }
    | ApiErrorResponse;
