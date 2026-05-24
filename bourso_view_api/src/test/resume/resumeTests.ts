import type { TestSuite } from "../types";

/** Aligné sur {@link import("Shared/RouteType").Actions.map.getResumeAction} */
const GET_RESUME_ACTION = "getResume";

/**
 * Suite de tests pour la route getResume (feuille Resume).
 */
export function createResumeSuite(authToken: string): TestSuite {
    return {
        name: "Resume",
        description: "Tests de la route getResume (résumé portefeuille)",
        tests: [
            {
                name: "Get resume avec token valide",
                description: "Retourne success=true et la structure fund / transaction / dividendes",
                method: "POST",
                action: GET_RESUME_ACTION,
                body: { authToken },
                assertions: [{ field: "success", expected: true }]
            },
            {
                name: "Get resume token invalide",
                description: "401 si le token est invalide",
                method: "POST",
                action: GET_RESUME_ACTION,
                body: { authToken: "token-invalide-123" },
                assertions: [
                    { field: "success", expected: false },
                    { field: "code", expected: 401 }
                ]
            },
            {
                name: "Get resume token manquant",
                description: "400 si authToken est absent",
                method: "POST",
                action: GET_RESUME_ACTION,
                body: {},
                assertions: [
                    { field: "success", expected: false },
                    { field: "code", expected: 400 }
                ]
            }
        ]
    };
}
