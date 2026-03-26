import type { TestSuite } from "../types";

/** Aligné sur {@link import("Shared/RouteType").Actions.map.getReferentielAction} */
const GET_REFERENTIEL_ACTION = "getReferentiel";

/**
 * Suite de tests pour la route POST ?action=getReferentiel (liste des référentiels).
 * Même schéma que la route auth : body `{ authToken }`, protection par middleware.
 */
export function createReferentielSuite(authToken: string): TestSuite {
    return {
        name: "Referentiel",
        description: "Tests de la route getReferentiel (récupération de tous les référentiels)",
        tests: [
            {
                name: "Liste avec token valide",
                description: "Retourne success et data.referentiels (tableau) avec un token valide",
                method: "POST",
                action: GET_REFERENTIEL_ACTION,
                body: { authToken },
                assertions: [{ field: "success", expected: true }]
            },
            {
                name: "Token invalide",
                description: "401 si le token ne correspond pas",
                method: "POST",
                action: GET_REFERENTIEL_ACTION,
                body: { authToken: "token-invalide-123" },
                assertions: [
                    { field: "success", expected: false },
                    { field: "code", expected: 401 }
                ]
            },
            {
                name: "Token manquant",
                description: "400 si authToken est absent du body",
                method: "POST",
                action: GET_REFERENTIEL_ACTION,
                body: {},
                assertions: [
                    { field: "success", expected: false },
                    { field: "code", expected: 400 }
                ]
            },
            {
                name: "Token vide",
                description: "Échec de validation si authToken est une chaîne vide",
                method: "POST",
                action: GET_REFERENTIEL_ACTION,
                body: { authToken: "" },
                assertions: [{ field: "success", expected: false }]
            },
            {
                name: "Action manquante",
                description: "Échec si le paramètre action n'est pas fourni",
                method: "POST",
                body: { authToken },
                assertions: [{ field: "success", expected: false }]
            }
        ]
    };
}
