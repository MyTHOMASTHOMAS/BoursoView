/**
 * Fichier de test principal pour BoursoViewApi (Runner GAS)
 * 
 * Les configurations de test proviennent du fichier .env.test.
 * Les définitions de tests sont dans `src/test/`.
 * Ce fichier exécute les suites via le gasRunner (appels internes doGet/doPost).
 */

import { runSuiteGas } from "./test/gasRunner";
import { AUTH_TOKEN } from "./test/config";
import { createAuthSuite } from "./test/auth";
import { createReferentielSuite } from "./test/referentiel";
import { healthSuite } from "./test/health";
import { createAchatSuite } from "./test/achat";

/**
 * Exécute tous les tests via le runner GAS
 */
export function runAllTests(): void {
    Logger.log("🚀 Démarrage de tous les tests (GAS Runner)");
    Logger.log("============================================\n");

    runSuiteGas(healthSuite);
    runSuiteGas(createAuthSuite(AUTH_TOKEN!));
    runSuiteGas(createReferentielSuite(AUTH_TOKEN!));
    runSuiteGas(createAchatSuite(AUTH_TOKEN!));

    Logger.log("============================================");
    Logger.log("✅ Tous les tests terminés");
    Logger.log("============================================");
}