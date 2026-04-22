import type { TestSuite } from "../types";

/** Aligné sur {@link import("Shared/RouteType").Actions.map.getReferentielAction} */
const GET_REFERENTIEL_ACTION = "getReferentiel";
/** Aligné sur {@link import("Shared/RouteType").Actions.map.createReferentielAction} */
const CREATE_REFERENTIEL_ACTION = "createReferentiel";
/** Aligné sur {@link import("Shared/RouteType").Actions.map.deleteReferentielAction} */
const DELETE_REFERENTIEL_ACTION = "deleteReferentiel";

/**
 * Suite de tests pour les routes Referentiel.
 * Structure alignée sur la suite Transaction.
 */
export function createReferentielSuite(authToken: string): TestSuite {
    const uniqueId = `test-referentiel-${Date.now()}`;

    return {
        name: "Referentiel",
        description: "Tests des routes referentiel (getReferentiel, createReferentiel, deleteReferentiel)",
        tests: [
            {
                name: "Liste des referentiels avec token valide",
                description: "Retourne success avec data.referentiels quand token valide",
                method: "POST",
                action: GET_REFERENTIEL_ACTION,
                body: { authToken },
                assertions: [{ field: "success", expected: true }]
            },
            {
                name: "Création referentiel valide",
                description: "Crée un referentiel et retourne createdCount=1",
                method: "POST",
                action: CREATE_REFERENTIEL_ACTION,
                body: {
                    authToken,
                    id: uniqueId,
                    name: "Referentiel Test",
                    isin: `ISIN-${Date.now()}`,
                    management_fee: 0.25
                },
                assertions: [
                    { field: "success", expected: true },
                    { field: "data.createdCount", expected: 1 }
                ]
            },
            {
                name: "Suppression referentiel (ligne inexistante)",
                description: "Appelle deleteReferentiel avec une ligne hors limites et retourne deleted=false",
                method: "POST",
                action: DELETE_REFERENTIEL_ACTION,
                body: {
                    authToken,
                    line: 999999
                },
                assertions: [
                    { field: "success", expected: true },
                    { field: "data.deleted", expected: false }
                ]
            },
            {
                name: "Get referentiel token invalide",
                description: "401 si le token de getReferentiel est invalide",
                method: "POST",
                action: GET_REFERENTIEL_ACTION,
                body: { authToken: "token-invalide-123" },
                assertions: [
                    { field: "success", expected: false },
                    { field: "code", expected: 401 }
                ]
            },
            {
                name: "Create referentiel token manquant",
                description: "400 si authToken est absent sur createReferentiel",
                method: "POST",
                action: CREATE_REFERENTIEL_ACTION,
                body: {
                    id: `missing-token-${Date.now()}`,
                    name: "Referentiel Missing Token",
                    isin: `ISIN-MISSING-${Date.now()}`,
                    management_fee: 0.15
                },
                assertions: [
                    { field: "success", expected: false },
                    { field: "code", expected: 400 }
                ]
            }
        ]
    };
}
