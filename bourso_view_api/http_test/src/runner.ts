import type { TestCase, TestResult, TestSuite } from "../../src/test/types";
import { BASE_URL } from "../config";

/**
 * Résout une valeur imbriquée avec notation dot (ex: "data.success")
 */
function getNestedValue(obj: unknown, path: string): unknown {
    return path.split(".").reduce((current: any, key) => {
        return current != null ? current[key] : undefined;
    }, obj);
}

/**
 * Exécute un cas de test HTTP contre l'API GAS déployée.
 */
export async function runTest(test: TestCase): Promise<TestResult> {
    const start = performance.now();

    try {
        let url = BASE_URL;
        if (test.action) {
            url += `?action=${encodeURIComponent(test.action)}`;
        }

        const options: RequestInit = {
            method: test.method,
            redirect: "follow",
        };

        if (test.body && (test.method === "POST" || test.method === "PUT" || test.method === "PATCH")) {
            options.headers = { "Content-Type": "text/plain;charset=UTF-8" };
            options.body = JSON.stringify(test.body);
        }

        const res = await fetch(url, options);
        const text = await res.text();

        let response: unknown;
        try {
            response = JSON.parse(text);
        } catch {
            response = text;
        }

        const assertionResults = test.assertions.map((assertion) => {
            const actual = getNestedValue(response, assertion.field);
            return {
                assertion,
                passed: actual === assertion.expected,
                actual,
            };
        });

        const passed = assertionResults.every((r) => r.passed);
        const duration = Math.round(performance.now() - start);

        return { test, passed, duration, response, assertionResults };
    } catch (err) {
        const duration = Math.round(performance.now() - start);
        return {
            test,
            passed: false,
            duration,
            response: null,
            assertionResults: [],
            error: err instanceof Error ? err.message : String(err),
        };
    }
}

/**
 * Exécute tous les tests d'une suite
 */
export async function runSuite(suite: TestSuite): Promise<TestResult[]> {
    const results: TestResult[] = [];
    for (const test of suite.tests) {
        results.push(await runTest(test));
    }
    return results;
}
