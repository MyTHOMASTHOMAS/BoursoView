import { TableConfig } from "MypkgAppsScript/SheetsOrm/table/TableTypes";
import { Position } from "MypkgAppsScript/SheetsService/src/SheetServiceTypes";

/**
 * Configuration de la table Dividende
 * 
 * Colonnes :
 * - id : Identifiant unique (élément contigu)
 * - titre : Titre (lecture seule)
 * - date : Date du dividende
 * - amount_brut : Montant brut
 * - taxe : Taxe
 * - commission : Commission
 * - amount_net : Montant net (lecture seule)
 */
export const DIVIDENDE_TABLE_CONFIG: TableConfig = {
    sheetName: "Dividende",
    startPos: [0, 1] as Position, // Colonne A, Ligne 2 (ligne 1 = en-têtes)
    markedIndex: 0, // Colonne id comme marqueur contigu
    dataConfig: [
        { name: "id" },
        { name: "titre", readonly: true }, // Lecture seule
        { name: "date" },
        { name: "amount_brut" },
        { name: "taxe" },
        { name: "commission" },
        { name: "amount_net", readonly: true } // Lecture seule
    ]
};
