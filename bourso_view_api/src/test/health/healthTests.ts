import type { TestSuite } from "../types";

export const healthSuite: TestSuite = {
    name: "Health",
    description: "Vérifie que l'API est en ligne et fonctionnelle",
    tests: [
        {
            name: "Health Check GET",
            description: "Vérifie que l'API répond avec un message de succès",
            method: "GET",
            assertions: [
                { field: "success", expected: true },
                { field: "data.success", expected: true },
                { field: "data.message", expected: "BoursoViewApi est en ligne" }
            ]
        }
    ]
};
