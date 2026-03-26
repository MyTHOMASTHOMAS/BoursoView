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
        { name: "price", readonly: true } // Lecture seule
    ]
};
