import { TableConfig } from "MypkgAppsScript/SheetsOrm/table/TableTypes";
import { Position } from "MypkgAppsScript/SheetsService/src/SheetServiceTypes";

/**
 * Configuration de la table TransactionTotal
 *
 * Colonnes (ordre feuille, a partir de A) :
 * - id, price, nb, nb j-1, nb j-7, nb -1mois, nb -6mois, nb -1ans
 * - comission, fee, pru
 * - total invested, invested j-1, invested j-7, invested -1 mois, invested -6mois, invested -1 an
 * - total estimated, estimated j-1, estimated j-7, estimated -1 mois, estimated -6mois, estimated -1 an
 *
 * Table en lecture seule : toutes les colonnes sont marquees readonly.
 */
export const TRANSACTION_TOTAL_TABLE_CONFIG: TableConfig = {
    sheetName: "TransactionTotal",
    startPos: [0, 1] as Position,
    markedIndex: 0,
    dataConfig: [
        { name: "id", readonly: true },
        { name: "price", readonly: true },
        { name: "nb", readonly: true },
        { name: "nb_j_1", readonly: true },
        { name: "nb_j_7", readonly: true },
        { name: "nb_1_mois", readonly: true },
        { name: "nb_6_mois", readonly: true },
        { name: "nb_1_an", readonly: true },
        { name: "comission", readonly: true },
        { name: "fee", readonly: true },
        { name: "pru", readonly: true },
        { name: "total_invested", readonly: true },
        { name: "invested_j_1", readonly: true },
        { name: "invested_j_7", readonly: true },
        { name: "invested_1_mois", readonly: true },
        { name: "invested_6_mois", readonly: true },
        { name: "invested_1_an", readonly: true },
        { name: "estimated", readonly: true },
        { name: "estimated_j_1", readonly: true },
        { name: "estimated_j_7", readonly: true },
        { name: "estimated_1_mois", readonly: true },
        { name: "estimated_6_mois", readonly: true },
        { name: "estimated_1_an", readonly: true }
    ]
};
