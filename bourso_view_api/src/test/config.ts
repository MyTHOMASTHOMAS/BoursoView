/**
 * Configuration pour les tests GAS (exécutés en interne via doGet/doPost).
 * Les variables process.env sont remplacées par Vite via dotenv au build (.env.test).
 */

/** Token d'authentification valide pour les tests GAS */
export const AUTH_TOKEN = process.env.TEST_AUTH_TOKEN;
