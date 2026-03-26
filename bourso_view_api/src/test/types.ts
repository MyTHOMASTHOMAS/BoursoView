/**
 * Types partagés pour le système de tests.
 * Utilisés à la fois par le runner GAS (src/test.ts) et le runner HTTP (http_test/).
 */

/** Méthode HTTP supportée */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/** Assertion sur la réponse d'un test */
export interface TestAssertion {
    /** Champ à vérifier dans la réponse JSON (notation dot, ex: "data.success") */
    field: string;
    /** Valeur attendue */
    expected: unknown;
}

/** Définition d'un cas de test */
export interface TestCase {
    /** Nom court du test */
    name: string;
    /** Description détaillée */
    description: string;
    /** Méthode HTTP */
    method: HttpMethod;
    /** Action GAS (paramètre ?action=...), undefined pour GET sans action */
    action?: string;
    /** Body JSON (pour POST/PUT/PATCH) */
    body?: Record<string, unknown>;
    /** Assertions à vérifier sur la réponse */
    assertions: TestAssertion[];
}

/** Résultat d'exécution d'un test */
export interface TestResult {
    /** Le cas de test exécuté */
    test: TestCase;
    /** Succès global (toutes les assertions passées) */
    passed: boolean;
    /** Durée d'exécution en ms */
    duration: number;
    /** Réponse JSON brute */
    response: unknown;
    /** Détails des assertions */
    assertionResults: {
        assertion: TestAssertion;
        passed: boolean;
        actual: unknown;
    }[];
    /** Erreur éventuelle (réseau, parsing, etc.) */
    error?: string;
}

/** Suite de tests regroupés par fonctionnalité */
export interface TestSuite {
    /** Nom de la suite (ex: "Auth", "Health") */
    name: string;
    /** Description de la suite */
    description: string;
    /** Liste des cas de test */
    tests: TestCase[];
}
