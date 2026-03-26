# shared/RouteType

[Retour a shared](../README.md)

Le dossier `shared/RouteType` definit le contrat commun des routes API entre le frontend (`BoursoViewFront`) et le backend (`BoursoViewApi`).

Son objectif est de centraliser :
- les actions disponibles ;
- les formats de contexte et de validation ;
- les types de reponse ;
- les types utilitaires partages pour typer les endpoints.

## Vue d'ensemble

Structure actuelle :

- `index.ts` : point d'entree principal de `RouteType`.
- `ApiEndpointConfig.ts` : type generique de configuration d'endpoint.
- `Actions/` : constantes des actions API (ex: `auth`).
- `Context/` : types de contexte associes aux actions.
- `Validator/` : schemas de validation des payloads.
- `Response/` : types de reponse succes/erreur.

## Detail par fichier

### Racine

- `index.ts`
  - Re-exporte les modules `ContextType`, `ResponseType`, `Validator`, `Actions`.
  - Re-exporte aussi le type `ApiEndpointConfig`.
  - Utilite : offrir un seul point d'import pour le front et le back.

- `ApiEndpointConfig.ts`
  - Definit `ApiEndpointConfig<TBody, TData>`.
  - Modele actuel : endpoint `post` avec `body` contenant `TBody` + `authToken`.
  - `data` represente la charge utile retournee en succes.
  - Utilite : imposer un format commun de contrat d'endpoint pour reduire les divergences entre front et back.

### Dossier `Actions/`

- `actions.ts`
  - Contient les constantes d'actions (actuellement `authAction = "auth"`).
  - Utilite : eviter les valeurs en dur dans le code applicatif.

- `index.ts`
  - Exporte `map`, `list`, et `Type`.
  - `map` : objet des actions exportees.
  - `list` : tableau des valeurs d'actions.
  - `Type` : union TypeScript de toutes les actions disponibles.
  - Utilite : centraliser la decouverte et le typage des actions.

### Dossier `Context/`

- `auth.ts`
  - Type `AuthAction` avec `authToken: string`.
  - Utilite : decrire le contexte attendu pour l'action `auth`.

- `index.ts`
  - Re-exporte les types de contexte (actuellement `auth`).
  - Utilite : point d'entree unique pour les contextes.

### Dossier `Validator/`

- `auth.ts`
  - Schema de validation `authAction` via `NVB` (`MypkgTypescript/Validator`).
  - Exige un objet avec `authToken` obligatoire de type `string`.
  - Utilite : aligner la validation runtime du backend avec le contrat TypeScript partage.

- `index.ts`
  - Re-exporte les validateurs (actuellement `auth`).
  - Utilite : simplifier les imports des schemas de validation.

### Dossier `Response/`

- `error.ts`
  - `ApiErrorResponse` : format d'erreur standard (`success: false`, `error`, etc.).
  - `ApiResponse<T>` : union succes (`{ success: true; data: T }`) ou erreur.
  - Utilite : unifier le format de reponse de toutes les routes.

- `auth.ts`
  - Type de reponse de l'action `auth` (`{ message: string }`).
  - Utilite : typer explicitement le payload de la route d'authentification.

- `health.ts`
  - Type de reponse du health check (`success`, `message`, `timestamp`).
  - Utilite : typer la reponse de disponibilite de l'API (doGet).

- `index.ts`
  - Re-exporte les types `auth`, `error`, `health`.
  - Utilite : point d'entree unique pour les types de reponse.

## Utilite globale dans le projet

`shared/RouteType` est la reference de contrat API pour les deux applications :

- cote backend : aide a construire des routes, validateurs et reponses coherentes ;
- cote frontend : permet de typer les appels API et de securiser la consommation des reponses.

Ce dossier reduit les erreurs de synchronisation entre front et back en gardant les types au meme endroit.
