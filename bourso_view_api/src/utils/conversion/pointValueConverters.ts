import { googleSerialToDate } from "./sheetsDateConversion";
import type { SheetCellValue } from "../../config/sheet/pointValues.types";

const SHEET_NUMBER_DECIMALS = 2;

/**
 * Arrondit un nombre au nombre de décimales indiqué (défaut : 2).
 */
export function roundSheetDecimals(value: number, decimals = SHEET_NUMBER_DECIMALS): number {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
}

/**
 * Convertit une cellule numérique en nombre arrondi à 2 décimales (0 si invalide).
 */
export function toSheetNumber(raw: unknown): number {
    if (typeof raw === "number" && Number.isFinite(raw)) {
        return roundSheetDecimals(raw);
    }
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? roundSheetDecimals(parsed) : 0;
}

/**
 * Convertit une cellule en chaîne non vide.
 */
export function toSheetString(raw: unknown): string {
    if (raw === null || raw === undefined) return "";
    return String(raw);
}

/**
 * Convertit un serial date Google Sheets ou une Date en ISO (date seule).
 */
export function toSheetIsoDate(raw: unknown): string {
    if (typeof raw === "number") {
        return googleSerialToDate(raw).toISOString().slice(0, 10);
    }
    if (raw instanceof Date) {
        return raw.toISOString().slice(0, 10);
    }
    if (typeof raw === "string" && raw.length > 0) {
        const parsed = new Date(raw);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed.toISOString().slice(0, 10);
        }
        return raw;
    }
    return "";
}

/**
 * Retourne la valeur brute sans transformation.
 */
export function asSheetCellValue(raw: unknown): SheetCellValue {
    return raw as SheetCellValue;
}
