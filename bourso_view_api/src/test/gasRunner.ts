/**
 * Runner GAS — exécute les TestSuite en appelant doGet/doPost directement.
 * 
 * Convertit les TestCase déclaratifs en événements Google Apps Script
 * et évalue les assertions sur les réponses.
 */

import { doGet, doPost } from "../main";
import type { TestCase, TestSuite, TestAssertion } from "./types";

/**
 * Résout une valeur imbriquée avec notation dot (ex: "data.success")
 */
function getNestedValue(obj: unknown, path: string): unknown {
    return path.split(".").reduce((current: any, key) => {
        return current != null ? current[key] : undefined;
    }, obj);
}

/**
 * Construit un événement DoGet pour Google Apps Script
 */
function buildGetEvent(): GoogleAppsScript.Events.DoGet {
    return {
        parameter: {},
        parameters: {},
        queryString: "",
        pathInfo: "",
        contentLength: 0,
        contextPath: ""
    };
}

/**
 * Construit un événement DoPost pour Google Apps Script
 */
function buildPostEvent(test: TestCase): GoogleAppsScript.Events.DoPost {
    const body = test.body ? JSON.stringify(test.body) : "{}";
    const action = test.action || "";

    return {
        parameter: action ? { action } : {},
        parameters: action ? { action: [action] } : {},
        postData: {
            contents: body,
            name: "postData",
            type: "string" as any,
            length: body.length
        },
        queryString: action ? `action=${encodeURIComponent(action)}` : "",
        pathInfo: "",
        contentLength: body.length,
        contextPath: ""
    };
}

/**
 * Exécute un cas de test unique via les fonctions GAS internes.
 * Retourne true si toutes les assertions sont passées.
 */
function runTestGas(test: TestCase): boolean {
    Logger.log(`  📋 ${test.name} — ${test.description}`);

    try {
        let response: GoogleAppsScript.Content.TextOutput;

        if (test.method === "GET") {
            response = doGet(buildGetEvent());
        } else {
            response = doPost(buildPostEvent(test));
        }

        const content = response.getContent();
        const parsed = JSON.parse(content);

        // Évaluation des assertions
        let allPassed = true;
        for (const assertion of test.assertions) {
            const actual = getNestedValue(parsed, assertion.field);
            const passed = actual === assertion.expected;
            if (!passed) allPassed = false;

            const icon = passed ? "✔" : "✘";
            Logger.log(`     ${icon} ${assertion.field}: attendu ${JSON.stringify(assertion.expected)}, reçu ${JSON.stringify(actual)}`);
        }

        Logger.log(allPassed ? `  ✅ ${test.name} — PASS` : `  ❌ ${test.name} — FAIL`);
        return allPassed;
    } catch (error) {
        Logger.log(`  ❌ ${test.name} — ERREUR: ${error}`);
        return false;
    }
}

/**
 * Exécute tous les tests d'une suite via les fonctions GAS internes
 */
export function runSuiteGas(suite: TestSuite): void {
    Logger.log("============================================");
    Logger.log(`🧪 Suite: ${suite.name}`);
    Logger.log(`   ${suite.description}`);
    Logger.log("============================================");

    let passed = 0;
    let failed = 0;

    for (const test of suite.tests) {
        if (runTestGas(test)) {
            passed++;
        } else {
            failed++;
        }
    }

    Logger.log(`\n📊 Résultats: ${passed}/${passed + failed} tests passés`);
    Logger.log("");
}
