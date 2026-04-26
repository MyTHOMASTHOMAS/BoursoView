import type { TestSuite } from "../types";

/** Aligné sur {@link import("Shared/RouteType").Actions.map.getHistoryAction} */
const GET_HISTORY_ACTION = "getHistory";

/**
 * Suite de tests pour la route History.
 * Structure identique aux suites Auth/Referentiel/Transaction.
 */
export function createHistorySuite(authToken: string): TestSuite {
    return {
        name: "History",
        description: "Tests de la route history (getHistory)",
        tests: [
            {
                name: "Get history valide (DAILY)",
                description: "Retourne success=true avec des données historiques pour des indices valides",
                method: "POST",
                action: GET_HISTORY_ACTION,
                body: {
                    authToken,
                    indices: ["EPA:AI", "EPA:MC"],
                    start_date: "2026-01-01",
                    end_date: "2026-01-15",
                    period: "DAILY"
                },
                assertions: [{ field: "success", expected: true }]
            },
            {
                name: "Get history valide (WEEKLY)",
                description: "Retourne success=true avec le period WEEKLY",
                method: "POST",
                action: GET_HISTORY_ACTION,
                body: {
                    authToken,
                    indices: ["EPA:AI"],
                    start_date: "2026-01-01",
                    end_date: "2026-03-31",
                    period: "WEEKLY"
                },
                assertions: [{ field: "success", expected: true }]
            },
            {
                name: "Charge 1 indice ~1 an (DAILY)",
                description: "Vise plusieurs centaines de lignes avec 1 indice sur 1 an",
                method: "POST",
                action: GET_HISTORY_ACTION,
                body: {
                    authToken,
                    indices: ["EPA:AI"],
                    start_date: "2024-01-01",
                    end_date: "2024-12-31",
                    period: "DAILY"
                },
                assertions: [{ field: "success", expected: true }]
            },
            {
                name: "Charge 1 indice ~5 ans (DAILY)",
                description: "Vise environ 1k+ lignes sur une plage longue",
                method: "POST",
                action: GET_HISTORY_ACTION,
                body: {
                    authToken,
                    indices: ["EPA:MC"],
                    start_date: "2019-01-01",
                    end_date: "2024-12-31",
                    period: "DAILY"
                },
                assertions: [{ field: "success", expected: true }]
            },
            {
                name: "Charge multi indices ~3 ans (DAILY)",
                description: "Teste le volume en combinant plusieurs indices et une plage longue",
                method: "POST",
                action: GET_HISTORY_ACTION,
                body: {
                    authToken,
                    indices: ["EPA:AI", "EPA:MC", "EPA:SU", "EPA:OR"],
                    start_date: "2022-01-01",
                    end_date: "2024-12-31",
                    period: "DAILY"
                },
                assertions: [{ field: "success", expected: true }]
            },
            {
                name: "Charge extrême multi indices ~8 ans (DAILY)",
                description: "Stress test avec beaucoup de points et plusieurs indices pour observer la limite",
                method: "POST",
                action: GET_HISTORY_ACTION,
                body: {
                    authToken,
                    indices: ["EPA:AI", "EPA:MC", "EPA:SU", "EPA:OR", "EPA:BN", "EPA:CAP"],
                    start_date: "2016-01-01",
                    end_date: "2024-12-31",
                    period: "DAILY"
                },
                assertions: [{ field: "success", expected: true }]
            },
            {
                name: "Get history token invalide",
                description: "401 si le token est invalide",
                method: "POST",
                action: GET_HISTORY_ACTION,
                body: {
                    authToken: "token-invalide-123",
                    indices: ["EPA:AI"],
                    start_date: "2026-01-01",
                    end_date: "2026-01-15",
                    period: "DAILY"
                },
                assertions: [
                    { field: "success", expected: false },
                    { field: "code", expected: 401 }
                ]
            },
            {
                name: "Get history token manquant",
                description: "400 si authToken est absent",
                method: "POST",
                action: GET_HISTORY_ACTION,
                body: {
                    indices: ["EPA:AI"],
                    start_date: "2026-01-01",
                    end_date: "2026-01-15",
                    period: "DAILY"
                },
                assertions: [
                    { field: "success", expected: false },
                    { field: "code", expected: 400 }
                ]
            },
            {
                name: "Get history period invalide",
                description: "400 si period n'est pas dans DAILY/WEEKLY",
                method: "POST",
                action: GET_HISTORY_ACTION,
                body: {
                    authToken,
                    indices: ["EPA:AI"],
                    start_date: "2026-01-01",
                    end_date: "2026-01-15",
                    period: "MONTHLY"
                },
                assertions: [
                    { field: "success", expected: false },
                    { field: "code", expected: 400 }
                ]
            }
        ]
    };
}
