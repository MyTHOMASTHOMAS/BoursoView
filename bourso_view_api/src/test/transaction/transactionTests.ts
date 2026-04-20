import type { TestSuite } from "../types";

/** Aligné sur {@link import("Shared/RouteType").Actions.map.getTransactionsAction} */
const GET_TRANSACTIONS_ACTION = "getTransactions";
/** Aligné sur {@link import("Shared/RouteType").Actions.map.createTransactionAction} */
const CREATE_TRANSACTION_ACTION = "createTransaction";
/** Aligné sur {@link import("Shared/RouteType").Actions.map.deleteTransactionAction} */
const DELETE_TRANSACTION_ACTION = "deleteTransaction";

/**
 * Suite de tests pour les routes Transaction.
 * Structure identique aux suites Auth/Referentiel.
 */
export function createTransactionSuite(authToken: string): TestSuite {
    const uniqueId = `test-transaction-${Date.now()}`;

    return {
        name: "Transaction",
        description: "Tests des routes transaction (getTransactions, createTransaction, deleteTransaction)",
        tests: [
            {
                name: "Liste des transactions avec token valide",
                description: "Retourne success avec data.transactions quand token, limit et offset sont valides",
                method: "POST",
                action: GET_TRANSACTIONS_ACTION,
                body: { authToken, limit: 50, offset: 0 },
                assertions: [{ field: "success", expected: true }]
            },
            {
                name: "Création transaction valide",
                description: "Crée une transaction et retourne createdCount=1",
                method: "POST",
                action: CREATE_TRANSACTION_ACTION,
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
                name: "Suppression transaction (ligne inexistante)",
                description: "Appelle deleteTransaction avec une ligne hors limites et retourne deleted=false",
                method: "POST",
                action: DELETE_TRANSACTION_ACTION,
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
                name: "Get transactions token invalide",
                description: "401 si le token de getTransactions est invalide",
                method: "POST",
                action: GET_TRANSACTIONS_ACTION,
                body: { authToken: "token-invalide-123", limit: 10, offset: 0 },
                assertions: [
                    { field: "success", expected: false },
                    { field: "code", expected: 401 }
                ]
            },
            {
                name: "Create transaction token manquant",
                description: "400 si authToken est absent sur createTransaction",
                method: "POST",
                action: CREATE_TRANSACTION_ACTION,
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
