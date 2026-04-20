import type { TestSuite, TestResult } from "../../src/test/types";
import { runSuite } from "./runner";
import { AUTH_TOKEN } from "../config";
import { healthSuite } from "../../src/test/health";
import { createAuthSuite } from "../../src/test/auth";
import { createReferentielSuite } from "../../src/test/referentiel";
import { createTransactionSuite } from "../../src/test/transaction";

// ============================================
// Registre de toutes les suites de test
// Ajoutez vos nouvelles suites ici
// ============================================
const suites: TestSuite[] = [
    healthSuite,
    createAuthSuite(AUTH_TOKEN),
    createReferentielSuite(AUTH_TOKEN),
    createTransactionSuite(AUTH_TOKEN)
];

// ============================================
// Rendu DOM
// ============================================

function createSuiteElement(suite: TestSuite): HTMLElement {
    const section = document.createElement("section");
    section.className = "suite";
    section.id = `suite-${suite.name.toLowerCase()}`;

    section.innerHTML = `
        <div class="suite-header">
            <div class="suite-info">
                <h2>${suite.name}</h2>
                <p class="suite-desc">${suite.description}</p>
            </div>
            <button class="btn btn-run-suite" data-suite="${suite.name}">
                ▶ Lancer
            </button>
        </div>
        <div class="suite-results"></div>
    `;

    return section;
}

function renderTestResult(result: TestResult): HTMLElement {
    const div = document.createElement("div");
    div.className = `test-result ${result.passed ? "passed" : "failed"}`;

    const icon = result.passed ? "✅" : "❌";

    let assertionsHtml = "";
    if (result.assertionResults.length > 0) {
        assertionsHtml = `<div class="assertions">
            ${result.assertionResults.map(ar => {
            const aIcon = ar.passed ? "✔" : "✘";
            return `<div class="assertion ${ar.passed ? "a-pass" : "a-fail"}">
                    <span class="a-icon">${aIcon}</span>
                    <code>${ar.assertion.field}</code>
                    <span class="a-expected">attendu: <code>${JSON.stringify(ar.assertion.expected)}</code></span>
                    <span class="a-actual">reçu: <code>${JSON.stringify(ar.actual)}</code></span>
                </div>`;
        }).join("")}
        </div>`;
    }

    let errorHtml = "";
    if (result.error) {
        errorHtml = `<div class="test-error">⚠ ${result.error}</div>`;
    }

    div.innerHTML = `
        <div class="test-header">
            <span class="test-icon">${icon}</span>
            <span class="test-name">${result.test.name}</span>
            <span class="test-method">${result.test.method}</span>
            <span class="test-duration">${result.duration}ms</span>
            <span class="${result.passed ? "status-pass" : "status-fail"}">${result.passed ? "PASS" : "FAIL"}</span>
        </div>
        <div class="test-details">
            <p class="test-desc">${result.test.description}</p>
            ${errorHtml}
            ${assertionsHtml}
            <details class="response-details">
                <summary>Réponse brute</summary>
                <pre><code>${JSON.stringify(result.response, null, 2)}</code></pre>
            </details>
        </div>
    `;

    return div;
}

function setLoading(suiteEl: HTMLElement, loading: boolean) {
    const btn = suiteEl.querySelector(".btn-run-suite") as HTMLButtonElement;
    if (loading) {
        btn.disabled = true;
        btn.textContent = "⏳ En cours...";
    } else {
        btn.disabled = false;
        btn.textContent = "▶ Lancer";
    }
}

async function handleRunSuite(suite: TestSuite, suiteEl: HTMLElement) {
    const resultsContainer = suiteEl.querySelector(".suite-results") as HTMLElement;
    resultsContainer.innerHTML = "";
    setLoading(suiteEl, true);

    const results = await runSuite(suite);

    for (const result of results) {
        resultsContainer.appendChild(renderTestResult(result));
    }

    setLoading(suiteEl, false);

    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    const counter = document.createElement("div");
    counter.className = `suite-counter ${passed === total ? "all-pass" : "some-fail"}`;
    counter.textContent = `${passed}/${total} tests passés`;
    resultsContainer.prepend(counter);
}

// ============================================
// Initialisation
// ============================================

function init() {
    const app = document.getElementById("app")!;

    const header = document.createElement("header");
    header.innerHTML = `
        <h1>🧪 BoursoViewApi — HTTP Test Runner</h1>
        <p class="subtitle">${suites.length} suite(s) · ${suites.reduce((a, s) => a + s.tests.length, 0)} test(s)</p>
        <button class="btn btn-run-all" id="run-all">▶ Tout lancer</button>
    `;
    app.appendChild(header);

    const suitesContainer = document.createElement("main");
    suitesContainer.id = "suites";

    for (const suite of suites) {
        const suiteEl = createSuiteElement(suite);
        suitesContainer.appendChild(suiteEl);

        const btn = suiteEl.querySelector(".btn-run-suite")!;
        btn.addEventListener("click", () => handleRunSuite(suite, suiteEl));
    }

    app.appendChild(suitesContainer);

    document.getElementById("run-all")!.addEventListener("click", async () => {
        const allSuiteEls = document.querySelectorAll(".suite");
        for (let i = 0; i < suites.length; i++) {
            await handleRunSuite(suites[i], allSuiteEls[i] as HTMLElement);
        }
    });
}

document.addEventListener("DOMContentLoaded", init);
