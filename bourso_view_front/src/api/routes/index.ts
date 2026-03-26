/**
 * Point d'entrée des routes API.
 * Chaque route est déclarée dans son propre fichier puis réunie ici.
 */
export { health, type HealthMethodsConfig } from './health'
export { auth, type AuthMethodsConfig } from './auth'
export { referentiel, type ReferentielMethodsConfig } from './referentiel'
