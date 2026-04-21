/**
 * Utilitaire de conversion de dates pour Google Sheets / TypeScript
 * Projet : BoursoView
 */

const GOOGLE_SHEETS_EPOCH_DIFF = 25569; // Jours entre le 30/12/1899 et le 01/01/1970
const SECONDS_IN_DAY = 86400;
const MS_IN_DAY = SECONDS_IN_DAY * 1000;

/**
 * 1. Convertit un nombre Google Sheets (Serial) en Timestamp Unix (secondes)
 */
export const googleSerialToTimestamp = (serial: number): number => {
    const timestamp = (serial - GOOGLE_SHEETS_EPOCH_DIFF) * SECONDS_IN_DAY;
    return Math.floor(timestamp);
};

/**
 * 2. Convertit un nombre Google Sheets (Serial) en objet Date TypeScript
 */
export const googleSerialToDate = (serial: number): Date => {
    const timestampMs = (serial - GOOGLE_SHEETS_EPOCH_DIFF) * MS_IN_DAY;
    return new Date(timestampMs);
};

/**
 * 3. Convertit un Timestamp Unix (secondes) en nombre Google Sheets (Serial)
 */
export const timestampToGoogleSerial = (timestamp: number): number => {
    return (timestamp / SECONDS_IN_DAY) + GOOGLE_SHEETS_EPOCH_DIFF;
};

/**
 * 4. Convertit un objet Date TypeScript en nombre Google Sheets (Serial)
 */
export const dateToGoogleSerial = (date: Date): number => {
    return (date.getTime() / MS_IN_DAY) + GOOGLE_SHEETS_EPOCH_DIFF;
};

/**
 * BONUS : Formate une date Google Sheets directement en chaîne lisible (fr-FR)
 */
export const formatGoogleSerial = (serial: number): string => {
    const date = googleSerialToDate(serial);
    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'short',
        timeStyle: 'short'
    }).format(date);
};

/**
 * Convertit une date (chaîne, nombre ou objet Date) en un objet formaté
 * compréhensible par le SheetUpdateService pour Google Sheets.
 * @param dateInput - La date à convertir.
 * @param pattern - (Optionnel) Le masque d'affichage. Par défaut: "dd/MM/yyyy HH:mm:ss"
 * @returns Un objet { value, format } ou undefined si l'entrée est vide/invalide.
 */
export function dateToGoogleSheetFormat(
    dateInput: string | number | Date | null | undefined,
    pattern: string = "dd/MM/yyyy HH:mm:ss"
) {
    // 1. Gérer les cas vides
    if (!dateInput) return undefined;

    // 2. S'assurer d'avoir un objet Date valide
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) return undefined;

    // 3. Retourner la structure reconnue par parseCellInput
    return {
        value: dateToGoogleSerial(date), // Appel de votre fonction de conversion mathématique
        format: {
            numberFormat: {
                type: "DATE_TIME",
                pattern: pattern
            }
        },
        fieldList: [
            "userEnteredValue",               // 1. On autorise l'écriture de la valeur
            "userEnteredFormat.numberFormat"  // 2. On met à jour UNIQUEMENT le format du nombre
        ]
    };
}