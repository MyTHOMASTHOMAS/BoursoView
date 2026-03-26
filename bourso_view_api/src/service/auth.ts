import { CacheManager } from "MypkgAppsScript/CacheManager";
import { sheetService } from "./sheet";
import { AUTH_SHEET_NAME, AUTH_TOKEN_CELL } from "../config/auth/auth.constants";
import {CacheConfig} from "MypkgAppsScript/CacheManager/CacheTypes";

/**
 * Configuration du cache pour le token d'authentification
 */
const authTokenCacheConfig: CacheConfig<[], string> = {
    keyBase: 'AUTH_TOKEN',
    fetch: () => {
        // Récupérer le token depuis la feuille Auth, cellule A1
        const futureValue = sheetService.read.queueGetValue<string>(AUTH_SHEET_NAME, AUTH_TOKEN_CELL);
        sheetService.read.flush();
        return futureValue.get();
    },
    ttl: 3600 * 6, // Cache pendant 1 heure
    scope: 'SCRIPT' // Cache partagé entre tous les utilisateurs
};

/**
 * Récupère le token d'authentification depuis la feuille Auth
 * Le token est mis en cache pour éviter les appels répétés à Google Sheets
 * 
 * @returns Le token d'authentification
 */
export function getAuthToken(): string {
    return CacheManager.get(authTokenCacheConfig, []);
}

/**
 * Invalide le cache du token d'authentification
 * Utile après une mise à jour du token dans la feuille
 */
export function invalidateAuthTokenCache(): void {
    CacheManager.invalidate(authTokenCacheConfig, []);
}
