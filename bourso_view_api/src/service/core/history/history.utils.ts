import type { ContextType as CT, ResponseType as RT } from "Shared/RouteType";
import { googleSerialToDate } from "../../../utils/conversion/sheetsDateConversion";

export const HISTORY_TEMP_SHEET = "calculs_temp";
export const HISTORY_BLOCK_WIDTH = 7;
export const HISTORY_VALUE_COLUMNS = 6;
export const HISTORY_MAX_ROWS = 1000;
export const HISTORY_CALC_WAIT_MS = 1500;

type HistoryPeriod = CT.HistoryPeriod;
export type FinanceCell = string | number | boolean | Date | null | undefined;
export type FinanceRow = FinanceCell[];

/**
 * Construit une formule GOOGLEFINANCE pour l'historique.
 */
export function buildGoogleFinanceHistoryFormula(
    ticker: string,
    startDate: string,
    endDate: string,
    period: HistoryPeriod
): string {
    const safeTicker = ticker.replace(/"/g, "");
    const safeStartDate = startDate.replace(/"/g, "");
    const safeEndDate = endDate.replace(/"/g, "");

    return `=GOOGLEFINANCE("${safeTicker}"; "ALL"; DATEVALUE("${safeStartDate}"); DATEVALUE("${safeEndDate}"); "${period}")`;
}

/**
 * Transforme les lignes brutes Google Sheets en structure TickerData.
 */
export function transformFinanceRows(rawRows: FinanceRow[]): RT.TickerData {
    const result: RT.TickerData = {
        date: [],
        open: [],
        high: [],
        low: [],
        close: [],
        volume: []
    };

    if (!rawRows || rawRows.length <= 1) {
        return result;
    }

    const firstCell = rawRows[0]?.[0];
    if (firstCell === "#N/A" || firstCell === "#REF!" || firstCell === "#ERROR!") {
        return result;
    }

    for (let i = 1; i < rawRows.length; i++) {
        const row = rawRows[i];
        const dateValue = row?.[0];

        if (dateValue === undefined || dateValue === null || dateValue === "") {
            break;
        }

        result.date.push(normalizeDate(dateValue));
        result.open.push(toNumber(row?.[1]));
        result.high.push(toNumber(row?.[2]));
        result.low.push(toNumber(row?.[3]));
        result.close.push(toNumber(row?.[4]));
        result.volume.push(toNumber(row?.[5]));
    }

    return result;
}

function normalizeDate(value: unknown): string {
    if (typeof value === "number") {
        return googleSerialToDate(value).toISOString().slice(0, 10);
    }

    if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
    }

    if (typeof value === "string") {
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed.toISOString().slice(0, 10);
        }
        return value;
    }

    return String(value);
}

function toNumber(value: unknown): number {
    if (typeof value === "number") return value;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}
