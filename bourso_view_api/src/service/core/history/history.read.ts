import type { ContextType as CT, ResponseType as RT } from "Shared/RouteType";
import { numberToLetter } from "MypkgAppsScript/SheetsService";
import { sheetService } from "../../sheet";
import {
    buildGoogleFinanceHistoryFormula,
    FinanceRow,
    HISTORY_BLOCK_WIDTH,
    HISTORY_CALC_WAIT_MS,
    HISTORY_MAX_ROWS,
    HISTORY_TEMP_SHEET,
    HISTORY_VALUE_COLUMNS,
    transformFinanceRows
} from "./history.utils";

type HistoryPayload = Pick<CT.GetHistoryAction, "indices" | "start_date" | "end_date" | "period">;

export default {
    get(payload: HistoryPayload): RT.GetHistoryAction {
        const indices = sanitizeIndices(payload.indices);
        if (indices.length === 0) return {};

        const period = payload.period ?? "DAILY";

        try {
            indices.forEach((ticker, index) => {
                const colStart = (index * HISTORY_BLOCK_WIDTH) + 1;
                const startCell = `${numberToLetter(colStart - 1)}1`;
                const formula = buildGoogleFinanceHistoryFormula(
                    ticker,
                    payload.start_date,
                    payload.end_date,
                    period
                );

                sheetService.update.queueUpdateCell(HISTORY_TEMP_SHEET, startCell, formula);
            });

            sheetService.update.flush();
            SpreadsheetApp.flush();
            Utilities.sleep(HISTORY_CALC_WAIT_MS);

            const futures: Record<string, ReturnType<typeof sheetService.read.queueGetValues<FinanceRow>>> = {};

            indices.forEach((ticker, index) => {
                const startCol = numberToLetter(index * HISTORY_BLOCK_WIDTH);
                const endCol = numberToLetter((index * HISTORY_BLOCK_WIDTH) + HISTORY_VALUE_COLUMNS - 1);
                const rangeA1 = `${startCol}1:${endCol}${HISTORY_MAX_ROWS}`;

                futures[ticker] = sheetService.read.queueGetValues<FinanceRow>(HISTORY_TEMP_SHEET, rangeA1);
            });

            sheetService.read.flush();

            const data: RT.GetHistoryAction = {};
            indices.forEach((ticker) => {
                const rows = futures[ticker]?.get() ?? [];
                data[ticker] = transformFinanceRows(rows);
            });

            return data;
        } finally {
            try {
                sheetService.clear.queueClearDataRange(HISTORY_TEMP_SHEET);
                sheetService.clear.flush();
            } catch (cleanupError) {
                console.error("[history.read.get] Erreur nettoyage feuille calculs_temp", cleanupError);
            }
        }
    }
};

function sanitizeIndices(indices: string[]): string[] {
    const seen = new Set<string>();
    const cleaned: string[] = [];

    indices.forEach((index) => {
        const value = index.trim();
        if (!value) return;
        if (seen.has(value)) return;
        seen.add(value);
        cleaned.push(value);
    });

    return cleaned;
}
