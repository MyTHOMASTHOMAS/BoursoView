import { createOrmInstance } from "../config/orm";

/**
 * Vérifie que SPREADSHEET_ID est défini
 */
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
if (!SPREADSHEET_ID) {
    throw new Error(
        "SPREADSHEET_ID n'est pas défini. " +
        "Assurez-vous d'avoir défini SPREADSHEET_ID dans votre fichier .env ou dans les variables d'environnement."
    );
}

/**
 * Instance de l'ORM pour accéder aux repositories des tables
 */
export const db = createOrmInstance(SPREADSHEET_ID);
/**
 * Instance du SheetService pour les opérations directes sur Google Sheets
 * Utilise la même instance que l'ORM pour partager le cache et optimiser les performances
 */
export const sheetService = db.getSheetsService();

