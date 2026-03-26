/**
 * Type de réponse pour le health check (doGet).
 * Retourné lorsque l’API est appelée en GET sur l’URL de base.
 */
export type HealthResponse = {
    success: true;
    message: string;
    timestamp: string; // ISO 8601
};
