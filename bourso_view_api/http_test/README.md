# Tests HTTP — BoursoViewApi

Interface graphique pour exécuter les tests HTTP contre l'API Google Apps Script déployée.

## 🏗️ Architecture

Le projet utilise une **structure de tests unifiée** : les définitions de tests (suites, cas, assertions) sont centralisées dans `src/test/` et partagées entre deux runners.

```
src/test/                          ← Définitions partagées
├── types.ts                       ← Types (TestCase, TestSuite, TestResult)
├── config.ts                      ← Config GAS (process.env via .env.test)
├── gasRunner.ts                   ← Runner GAS (appels internes doGet/doPost)
├── auth/
│   ├── authTests.ts               ← createAuthSuite(token) — factory
│   └── index.ts
└── health/
    ├── healthTests.ts             ← healthSuite
    └── index.ts

http_test/                         ← Runner HTTP + GUI Vite
├── config.ts                      ← Config HTTP (BASE_URL, AUTH_TOKEN hardcodés)
├── index.html                     ← Interface graphique
├── vite.config.ts                 ← Config du dev server Vite
└── src/
    ├── runner.ts                  ← Moteur d'exécution (fetch + assertions)
    └── index.ts                   ← Point d'entrée GUI (importe les suites depuis src/test/)
```

### Deux modes d'exécution

| Mode | Runner | Config | Usage |
|------|--------|--------|-------|
| **GAS** | `src/test/gasRunner.ts` | `src/test/config.ts` (.env.test) | Exécution interne via `doGet`/`doPost` dans Apps Script |
| **HTTP** | `http_test/src/runner.ts` | `http_test/config.ts` (hardcodé) | `fetch` contre l'API déployée, avec GUI Vite |

## 🚀 Lancement

```bash
npm run test:http
```

Cela démarre un serveur Vite sur le port **5174** et ouvre automatiquement l'interface dans le navigateur.

## ⚙️ Configuration

Modifiez `http_test/config.ts` avec vos valeurs :

```typescript
export const BASE_URL = "https://script.google.com/macros/s/VOTRE_DEPLOYMENT_ID/exec";
export const AUTH_TOKEN = "VOTRE_TOKEN_ICI";
```

## 🧪 Ajouter de nouveaux tests

1. **Créer un sous-dossier** dans `src/test/` (ex: `src/test/maRoute/`)
2. **Définir une `TestSuite`** dans un fichier dédié (ex: `maRouteTests.ts`) :
   ```typescript
   import type { TestSuite } from "../types";

   export function createMaRouteSuite(/* params */): TestSuite {
       return {
           name: "MaRoute",
           description: "Tests pour ma nouvelle route",
           tests: [
               {
                   name: "Cas nominal",
                   description: "Vérifie le comportement attendu",
                   method: "POST",
                   action: "maRoute",
                   body: { /* ... */ },
                   assertions: [
                       { field: "success", expected: true }
                   ]
               }
           ]
       };
   }
   ```
3. **Créer un `index.ts`** barrel export
4. **Enregistrer la suite** dans les deux runners :
   - `src/test.ts` → `runSuiteGas(createMaRouteSuite(...))`
   - `http_test/src/index.ts` → ajouter dans le tableau `suites`

## 📚 Structure des réponses API

### Succès (200)

```json
{
  "success": true,
  "data": { /* ... */ }
}
```

### Erreur (400 / 401 / 404 / 500)

```json
{
  "success": false,
  "error": "Message d'erreur",
  "code": 400,
  "message": "Détails",
  "errors": [{ "field": "champ", "message": "Erreur spécifique" }]
}
```
