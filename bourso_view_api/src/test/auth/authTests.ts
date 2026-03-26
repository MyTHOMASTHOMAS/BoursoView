import type { TestSuite } from "../types";

/**
 * Factory qui construit la suite de tests Auth.
 * Reçoit le token en paramètre pour fonctionner avec les deux configs (GAS / HTTP).
 */
export function createAuthSuite(authToken: string): TestSuite {
    return {
        name: "Auth",
        description: "Tests d'authentification via la route ?action=auth",
        tests: [
            {
                name: "Token valide",
                description: "Authentification réussie avec un token valide",
                method: "POST",
                action: "auth",
                body: { authToken },
                assertions: [
                    { field: "success", expected: true },
                    { field: "data.message", expected: "Authentifié avec succès" }
                ]
            },
            {
                name: "Token invalide",
                description: "Rejet d'un token qui ne correspond pas",
                method: "POST",
                action: "auth",
                body: { authToken: "token-invalide-123" },
                assertions: [
                    { field: "success", expected: false },
                    { field: "code", expected: 401 }
                ]
            },
            {
                name: "Token manquant",
                description: "Rejet quand le body ne contient pas authToken",
                method: "POST",
                action: "auth",
                body: {},
                assertions: [
                    { field: "success", expected: false },
                    { field: "code", expected: 400 }
                ]
            },
            {
                name: "Token vide",
                description: "Rejet quand authToken est une chaîne vide",
                method: "POST",
                action: "auth",
                body: { authToken: "" },
                assertions: [
                    { field: "success", expected: false }
                ]
            },
            {
                name: "Mauvais format (nombre)",
                description: "Rejet quand authToken est un nombre au lieu d'un string",
                method: "POST",
                action: "auth",
                body: { authToken: 12345 },
                assertions: [
                    { field: "success", expected: false }
                ]
            },
            {
                name: "Action manquante",
                description: "Rejet quand le paramètre action n'est pas spécifié",
                method: "POST",
                body: { authToken },
                assertions: [
                    { field: "success", expected: false }
                ]
            }
        ]
    };
}
