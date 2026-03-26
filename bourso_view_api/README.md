# BoursoViewApi

API Google Apps Script pour BoursoView. Ce projet compile du TypeScript en scripts GAS déployables et expose des points d’entrée (doGet, doPost) via un router.

---

## Structure du projet

```
BoursoViewApi/
├── build.mjs              # Script de build (Vite + plugins GAS)
├── build.config.json      # Configuration des points d’entrée et des libs
├── appsscript.json        # Manifeste GAS (copié dans dist/)
├── .env                    # Variables d’environnement (SPREADSHEET_ID, etc.)
├── src/
│   ├── main.ts            # Point d’entrée : doGet, doPost
│   ├── test.ts            # Fonctions de test exécutables dans l’éditeur GAS
│   ├── config/
│   │   ├── auth.constants.ts
│   │   ├── orm/           # Config ORM (tables, createOrmInstance)
│   │   └── route/         # Router ProcessRouter (routes, router)
│   ├── route/
│   │   ├── route.ts       # Registre des routes (auth, …)
│   │   └── routes/        # Définition des routes (auth.ts, …)
│   ├── middleware/       # Middlewares (auth)
│   └── service/          # Services (sheet, auth)
├── dist/                  # Sortie du build (main.js, test.js, appsscript.json)
└── http_test/             # Requêtes HTTP pour tester l’API (voir http_test/README.md)
```

- **Points d’entrée** : `main.ts` → `main.js` (doGet/doPost), `test.ts` → `test.js` (tests dans GAS).
- **Config** : routes et ORM dans `src/config` et `src/route`, env dans `.env`.
- **Build** : tout part de `build.config.json` et `build.mjs` ; la sortie va dans `dist/`.

---

## Configuration du build

### Fichier `build.config.json`

- **`entry`** : points d’entrée à compiler. Chaque clé donne le nom du fichier JS généré.
  - `main` → `src/main.ts` → `dist/main.js`
  - `test` → `src/test.ts` → `dist/test.js`
  - Pour chaque entrée on peut préciser :
    - `path` : fichier source.
    - `env` : fichier d’environnement (ex. `.env` ou `.env.test`) pour le remplacement de `process.env.*`.
- **`external_lib`** : alias vers les packages locaux (ex. `MypkgAppsScript`, `MypkgTypescript`) pour que les imports résolvent correctement pendant le build.

Exemple (structure typique) :

```json
{
  "entry": {
    "main": { "path": "src/main.ts", "env": ".env" },
    "test": { "path": "src/test.ts", "env": ".env.test" }
  },
  "external_lib": [
    { "alias": "MypkgAppsScript", "path": "../mypkg_packages_apps_script" },
    { "alias": "MypkgTypescript", "path": "../mypkg_packages_typescript" }
  ]
}
```

### Script `build.mjs`

- Lit `build.config.json` et `appsscript.json`.
- Pour chaque entrée :
  - Charge le fichier d’env associé (si `env` est défini).
  - Remplace dans le code les `process.env.VARIABLE` par les valeurs lues (plugin env-replace). Si une variable utilisée dans le code n’est pas définie dans le fichier env, le build échoue.
  - Compile l’entrée avec Vite (bundle IIFE, alias, minification en production).
  - Applique le plugin **GAS IIFE Bridge** : à partir des `export` du module, génère des fonctions globales en fin de fichier pour que GAS puisse appeler `doGet`, `doPost`, `testDoGet`, etc.
- Copie `appsscript.json` dans `dist/`.

En résumé : **TypeScript + Vite + remplacement d’env + bridge GAS** → `dist/main.js`, `dist/test.js` prêts pour `clasp push`.

### Commandes

| Commande        | Rôle |
|-----------------|------|
| `npm run build` | `tsc` puis build production (minification). |
| `npm run build:dev` | `tsc` puis build développement (sans minifier). |
| `npm run push`  | Envoie le contenu de `dist/` vers GAS (`clasp push`). |
| `npm run deploy` | Build production + push. |
| `npm run deploy:dev` | Build dev + push. |

### Variables d’environnement

- Définies dans `.env` (ou le fichier indiqué par `env` dans `build.config.json`).
- Utilisées dans le code sous la forme `process.env.NOM_VARIABLE` ; elles sont remplacées par des constantes au moment du build.
- Exemple : `SPREADSHEET_ID` pour cibler le bon Google Sheet. Ne pas commiter les fichiers `.env`.

---

## Tests

- **Dans l’éditeur GAS** : après déploiement, exécuter les fonctions exportées de `test.js` (ex. `testDoGet`, `testDoPost`, `runAllTests`) et consulter les logs.
- **Via HTTP** : utiliser les requêtes du dossier `http_test/` (REST Client, curl, etc.) contre l’URL de la Web App déployée. Voir [http_test/README.md](http_test/README.md).

---

## Déploiement

1. Configurer `.env` (au minimum `SPREADSHEET_ID`).
2. Lancer `npm run build` (ou `build:dev`).
3. Lancer `npm run push` (ou `npm run deploy` / `deploy:dev`).
4. Dans Google Apps Script, déployer la Web App depuis l’éditeur si ce n’est pas déjà fait.

Pour plus de détails sur les routes et les tests HTTP, voir [http_test/README.md](http_test/README.md).
