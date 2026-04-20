import type { TestSuite } from "../types";

/** Aligné sur {@link import("Shared/RouteType").Actions.map.getAchatsAction} */
const GET_ACHATS_ACTION = "getAchats";
/** Aligné sur {@link import("Shared/RouteType").Actions.map.createAchatAction} */
const CREATE_ACHAT_ACTION = "createAchat";
/** Aligné sur {@link import("Shared/RouteType").Actions.map.deleteAchatAction} */
const DELETE_ACHAT_ACTION = "deleteAchat";

/**
 * Suite de tests pour les routes Achat.
 * Structure identique aux suites Auth/Referentiel.
 */
export function createAchatSuite(authToken: string): TestSuite {
    const uniqueId = `test-achat-${Date.now()}`;

    return {
        name: "Achat",
        description: "Tests des routes achat (getAchats, createAchat, deleteAchat)",
        tests: [
            {
                name: "Liste des achats avec token valide",
                description: "Retourne success avec data.achats quand token, limit et offset sont valides",
                method: "POST",
                action: GET_ACHATS_ACTION,
                body: { authToken, limit: 50, offset: 0 },
                assertions: [{ field: "success", expected: true }]
            },
            {
                name: "Création achat valide",
                description: "Crée un achat et retourne createdCount=1",
                method: "POST",
                action: CREATE_ACHAT_ACTION,
                body: {
                    authToken,
                    id: uniqueId,
                    date: "2026-01-01",
                    price: 123.45,
                    nb: 2,
                    commission: 1.2,
                    fee: 0.5
                },
                assertions: [
                    { field: "success", expected: true },
                    { field: "data.createdCount", expected: 1 }
                ]
            },
            {
                name: "Suppression achat (ligne inexistante)",
                description: "Appelle deleteAchat avec une ligne hors limites et retourne deleted=false",
                method: "POST",
                action: DELETE_ACHAT_ACTION,
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
                name: "Get achats token invalide",
                description: "401 si le token de getAchats est invalide",
                method: "POST",
                action: GET_ACHATS_ACTION,
                body: { authToken: "token-invalide-123", limit: 10, offset: 0 },
                assertions: [
                    { field: "success", expected: false },
                    { field: "code", expected: 401 }
                ]
            },
            {
                name: "Create achat token manquant",
                description: "400 si authToken est absent sur createAchat",
                method: "POST",
                action: CREATE_ACHAT_ACTION,
                body: {
                    id: `missing-token-${Date.now()}`,
                    date: "2026-01-01",
                    price: 100,
                    nb: 1,
                    commission: 0,
                    fee: 0
                },
                assertions: [
                    { field: "success", expected: false },
                    { field: "code", expected: 400 }
                ]
            }
        ]
    };
}
