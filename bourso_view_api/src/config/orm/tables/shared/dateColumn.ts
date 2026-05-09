import { dateToGoogleSheetFormat, googleSerialToDate } from "../../../../utils/conversion/sheetsDateConversion";

/**
 * Cree une definition de colonne date reutilisable pour l'ORM:
 * - lecture: serial Google Sheets -> string ISO
 * - ecriture: string/date -> format date Google Sheets
 */
export function createIsoSheetDateColumn(name: string) {
    return {
        name,
        transform: (value: unknown) =>
            typeof value === "number"
                ? googleSerialToDate(value).toISOString()
                : "error",
        serializer: (value: unknown) => dateToGoogleSheetFormat(value as string | number | Date)
    };
}
