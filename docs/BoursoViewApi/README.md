# BoursoViewApi

[Retour a l'accueil de la documentation](../README.md)

`BoursoViewApi` est le backend Google Apps Script du projet.
Il expose une API via `doGet` et `doPost`, s'appuie sur Google Sheets comme source de donnees, et partage ses contrats avec le frontend via `shared/RouteType`.

## Structure du dossier

```text
BoursoViewApi/
├── src/
│   ├── main.ts
│   ├── route/
│   │   ├── route.ts
│   │   └── routes/
│   │       └── auth.ts
│   ├── middleware/
│   │   └── auth/
│   │       └── auth.ts
│   ├── service/
│   │   ├── sheet.ts
│   │   └── auth.ts
│   ├── config/
│   │   ├── auth/
│   │   │   └── auth.constants.ts
│   │   └── orm/
│   │       ├── index.ts
│   │       └── tables/
│   │           ├── referentiel.ts
│   │           ├── transaction.ts
│   │           └── dividende.ts
│   └── test/
│       ├── types.ts
│       ├── config.ts
│       ├── gasRunner.ts
│       ├── auth/
│       └── health/
├── http_test/
├── build.config.json
├── build.mjs
├── appsscript.json
├── package.json
└── dist/
```

## Role de chaque partie

### 1) Point d'entree API

- `src/main.ts`
  - `doGet` : health check (API en ligne + timestamp).
  - `doPost` : delegue le traitement au router.
  - C'est le point d'entree appele par Google Apps Script.

### 2) Routage et logique metier

- `src/route/route.ts`
  - Enregistre les routes POST disponibles.
  - Construit le router avec `createProcessRouter`.
  - Actuellement, la route `auth` est declaree.

- `src/route/routes/auth.ts`
  - Definit la route `auth` avec :
    - un validateur de body (`shared/RouteType/Validator`),
    - une logique metier basee sur un pipeline (`StartProcess`),
    - un middleware d'authentification.
  - Retourne un message de succes si le token est valide.

### 3) Middleware

- `src/middleware/auth/auth.ts`
  - Verifie `authToken` recu dans le body.
  - Compare le token recu avec le token attendu lu dans la feuille `Auth`.
  - Retourne une erreur 401 si token invalide.
  - Ajoute des metadonnees au contexte quand l'auth passe.

### 4) Services (acces donnees et utilitaires)

- `src/service/sheet.ts`
  - Initialise l'acces a Google Sheets via l'ORM (`SheetOrm`).
  - Exige `SPREADSHEET_ID` (injecte via build + env).
  - Expose :
    - `db` (instance ORM),
    - `sheetService` (operations bas niveau Sheets).

- `src/service/auth.ts`
  - Lit le token d'auth en feuille (`Auth!A1`).
  - Utilise un cache script (`CacheManager`) pour limiter les lectures Sheets.
  - Fournit aussi une fonction d'invalidation du cache.

### 5) Configuration

- `src/config/auth/auth.constants.ts`
  - Centralise les constantes d'auth (`AUTH_SHEET_NAME`, `AUTH_TOKEN_CELL`).

- `src/config/orm/index.ts`
  - Assemble la config ORM de toutes les tables.
  - Cree l'instance ORM via `createOrmInstance(spreadsheetId)`.

- `src/config/orm/tables/*.ts`
  - Decrivent les tables Google Sheets (`Referentiel`, `Transaction`, `Dividende`) :
    - nom de feuille,
    - position de depart,
    - colonne marqueur,
    - schema des colonnes,
    - champs en lecture seule.

### 6) Tests

- `src/test/`
  - Definissez les suites de tests partagees (types + cas de tests).
  - `gasRunner.ts` execute les tests en appelant directement `doGet`/`doPost`.
  - `src/test.ts` lance toutes les suites cote GAS.

- `http_test/`
  - Runner HTTP avec interface Vite.
  - Execute les memes suites contre une API deployee (via `fetch`).

## Build et deploiement

- `build.config.json`
  - Declare les entrees a compiler (`main`, `test`), leur fichier et leur env.
  - Declare les alias vers librairies locales (`MypkgAppsScript`, `MypkgTypescript`, `Shared`).

- `build.mjs`
  - Orchestrateur Vite multi-entrees.
  - Remplace `process.env.*` depuis les fichiers env.
  - Genere un bridge IIFE pour exposer les fonctions globales GAS (`doGet`, `doPost`, etc.).
  - Copie `appsscript.json` dans `dist/`.

- `appsscript.json`
  - Manifeste Google Apps Script.

- `dist/`
  - Sortie de build prete pour `clasp push`.

## Flux d'execution d'une requete POST

1. Google Apps Script appelle `doPost` (`src/main.ts`).
2. `doPost` delegue au router (`src/route/route.ts`).
3. Le router identifie l'action (`?action=auth`) et choisit la route.
4. La route valide le body via les validateurs partages (`shared/RouteType`).
5. Le middleware auth verifie le token (service + Google Sheets/cache).
6. La logique metier retourne une reponse typée succes ou erreur.

## Dependances structurantes

- `shared/RouteType` : contrat commun front/back (actions, validateurs, reponses).
- `MypkgAppsScript/ProcessRouter` : pipeline route/middleware/reponse.
- `MypkgAppsScript/SheetsOrm` : mapping table Sheets <-> objets.
- `MypkgAppsScript/CacheManager` : cache du token d'auth.
