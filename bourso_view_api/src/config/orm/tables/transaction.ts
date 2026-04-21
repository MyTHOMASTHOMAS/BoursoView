import { TableConfig } from "MypkgAppsScript/SheetsOrm/table/TableTypes";
import { Position } from "MypkgAppsScript/SheetsService/src/SheetServiceTypes";
import {dateToGoogleSheetFormat, googleSerialToDate} from "../../../utils/conversion/sheetsDateConversion";

/**
 * Configuration de la table Transaction
 * 
 * Colonnes :
 * - id : Identifiant unique (élément contigu)
 * - titre : Titre (lecture seule)
 * - date : Date de transaction
 * - price : Prix
 * - nb : Nombre
 * - commission : Commission
 * - fee : Frais
 * - pru : Prix de revient unitaire (lecture seule)
 * - total : Total (lecture seule)
 */
export const TRANSACTION_TABLE_CONFIG: TableConfig = {
    sheetName: "Transaction",
    startPos: [0, 1] as Position, // Colonne A, Ligne 2 (ligne 1 = en-têtes)
    markedIndex: 0, // Colonne id comme marqueur contigu
    dataConfig: [
        { name: "id" },
        { name: "titre", readonly: true }, // Lecture seule
        {
            name: "date",
            transform:
                (value) => typeof value === "number"
                    ? googleSerialToDate(value).toISOString()
                    : 'error',
            serializer: (value) => dateToGoogleSheetFormat(new Date(value))
        },
        { name: "price" },
        { name: "nb" },
        { name: "commission" },
        { name: "fee" },
        { name: "pru", readonly: true }, // Lecture seule
        { name: "total", readonly: true } // Lecture seule
    ]
};
