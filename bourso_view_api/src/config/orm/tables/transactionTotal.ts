import { TableConfig } from "MypkgAppsScript/SheetsOrm/table/TableTypes";
import { Position } from "MypkgAppsScript/SheetsService/src/SheetServiceTypes";

/**
 * Configuration de la table TransactionTotal
 *
 * Colonnes :
 * - id : Identifiant du produit (ex: ticker/code interne)
 * - price : Prix brut total (sans application des frais)
 * - nb : Quantite detenue
 * - comission : Total des commissions appliquees
 * - fee : Total des frais supplementaires
 * - pru : Prix de revient unitaire
 * - total_invested : Montant total investi apres application des frais
 * - estimated : Valorisation estimee actuelle
 * - estimated_j_1 : Valorisation estimee a J-1
 * - estimated_j_7 : Valorisation estimee a J-7
 * - estimated_1_mois : Valorisation estimee a 1 mois
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
        { name: "comission", readonly: true },
        { name: "fee", readonly: true },
        { name: "pru", readonly: true },
        { name: "total_invested", readonly: true },
        { name: "estimated", readonly: true },
        { name: "estimated_j_1", readonly: true },
        { name: "estimated_j_7", readonly: true },
        { name: "estimated_1_mois", readonly: true }
    ]
};
