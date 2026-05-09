import { TableConfig } from "MypkgAppsScript/SheetsOrm/table/TableTypes";
import { Position } from "MypkgAppsScript/SheetsService/src/SheetServiceTypes";

/**
 * Configuration de la table Fund
 *
 * Colonnes :
 * - date : Date
 * - montant : Montant
 * - total : Total (lecture seule)
 */
export const FUND_TABLE_CONFIG: TableConfig = {
    sheetName: "Fond",
    startPos: [0, 1] as Position,
    markedIndex: 0,
    dataConfig: [
        { name: "date" },
        { name: "montant" },
        { name: "total", readonly: true }
    ]
};
