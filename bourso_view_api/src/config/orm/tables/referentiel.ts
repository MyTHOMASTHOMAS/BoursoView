import { TableConfig } from "MypkgAppsScript/SheetsOrm/table/TableTypes";
import { Position } from "MypkgAppsScript/SheetsService/src/SheetServiceTypes";

/**
 * Configuration de la table Referentiel
 * 
 * Colonnes :
 * - id : Identifiant unique (élément contigu)
 * - name : Nom du produit
 * - isin : Code ISIN
 * - management_fee : Frais de gestion
 * - price : Prix (lecture seule)
 * - estimated_j_1 : Evolution a 1 jour (lecture seule)
 * - estimated_j_7 : Evolution a 7 jours (lecture seule)
 * - estimated_1_mois : Evolution a 1 mois (lecture seule)
 * - estimated_6_mois : Evolution a 6 mois (lecture seule)
 * - estimated_1_an : Evolution a 1 an (lecture seule)
 */
export const REFERENTIEL_TABLE_CONFIG: TableConfig = {
    sheetName: "Referentiel",
    startPos: [0, 1] as Position, // Colonne A, Ligne 2 (ligne 1 = en-têtes)
    markedIndex: 0, // Colonne id comme marqueur contigu
    dataConfig: [
        { name: "id" },
        { name: "name" },
        { name: "isin" },
        { name: "management_fee" },
        { name: "price", readonly: true }, // Lecture seule
        { name: "estimated_j_1", readonly: true }, // Lecture seule
        { name: "estimated_j_7", readonly: true }, // Lecture seule
        { name: "estimated_1_mois", readonly: true }, // Lecture seule
        { name: "estimated_6_mois", readonly: true }, // Lecture seule
        { name: "estimated_1_an", readonly: true } // Lecture seule
    ]
};
