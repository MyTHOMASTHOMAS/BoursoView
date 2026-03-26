import { router } from "./route/route";
import { createSuccessResponse } from "MypkgAppsScript/ProcessRouter";
import {createErrorResponse} from "MypkgAppsScript/ProcessRouter/src/Response";

/**
 * Point d'entrée pour les requêtes GET de Google Apps Script
 * 
 * Fonction de test pour vérifier que le projet est en ligne.
 * Retourne simplement un message de succès.
 * 
 * @param e - L'événement doGet de Google Apps Script
 * @returns Une réponse TextOutput avec un message de succès
 */
export function doGet(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.Content.TextOutput {
    return createSuccessResponse({
        success: true,
        message: "BoursoViewApi est en ligne",
        timestamp: new Date().toISOString()
    });
}

/**
 * Point d'entrée principal pour les requêtes POST de Google Apps Script
 * 
 * Le router ProcessRouter gère automatiquement :
 * - L'extraction de l'action depuis les paramètres (?action=...)
 * - Le parsing et la validation du body JSON
 * - L'exécution de la route correspondante
 * - La gestion des erreurs avec des réponses structurées
 * 
 * @param e - L'événement doPost de Google Apps Script
 * @returns Une réponse TextOutput avec le résultat JSON
 */
export function doPost(e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput {

    return router(e);
}