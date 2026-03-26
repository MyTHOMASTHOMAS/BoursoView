import { SheetOrm, BaseOrmConfig } from "MypkgAppsScript/SheetsOrm";
import { REFERENTIEL_TABLE_CONFIG } from "./tables/referentiel";
import { ACHAT_TABLE_CONFIG } from "./tables/achat";
import { DIVIDENDE_TABLE_CONFIG } from "./tables/dividende";

/**
 * Configuration complète de l'ORM
 * 
 * Réunit toutes les configurations de tables dans un seul objet.
 * Chaque table est définie dans son propre fichier sous ./tables/
 */
export const ORM_CONFIG = {
    referentiel: REFERENTIEL_TABLE_CONFIG,
    achat: ACHAT_TABLE_CONFIG,
    dividende: DIVIDENDE_TABLE_CONFIG
} as const satisfies BaseOrmConfig;

/**
 * Type dérivé de la configuration pour une utilisation typée
 */
export type OrmConfig = typeof ORM_CONFIG;

/**
 * Initialise une instance de SheetOrm avec la configuration complète
 * 
 * @param spreadsheetId - L'identifiant unique du Google Spreadsheet
 * @returns Une instance de SheetOrm configurée
 * 
 * @example
 * ```typescript
 * const db = createOrmInstance('votre-spreadsheet-id');
 * const referentielRepo = db.getRepository('referentiel');
 * ```
 */
export function createOrmInstance(spreadsheetId: string): SheetOrm {
    return new SheetOrm(spreadsheetId, ORM_CONFIG);
}
