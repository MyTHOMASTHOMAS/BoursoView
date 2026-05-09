import { TableConfig } from "MypkgAppsScript/SheetsOrm/table/TableTypes";
import { Position } from "MypkgAppsScript/SheetsService/src/SheetServiceTypes";

/**
 * Configuration de la table DividendeTotal
 *
 * Colonnes :
 * - id : Identifiant de la ligne de dividende (numerique)
 * - amount_brut : Montant brut du dividende
 * - taxe : Montant des taxes appliquees
 * - commission : Montant des commissions associees
 * - amount_net : Montant net recu apres taxes et commissions
 *
 * Table en lecture seule : toutes les colonnes sont marquees readonly.
 */
export const DIVIDENDE_TOTAL_TABLE_CONFIG: TableConfig = {
    sheetName: "DividendeTotal",
    startPos: [0, 1] as Position,
    markedIndex: 0,
    dataConfig: [
        { name: "id", readonly: true },
        { name: "amount_brut", readonly: true },
        { name: "taxe", readonly: true },
        { name: "commission", readonly: true },
        { name: "amount_net", readonly: true }
    ]
};
