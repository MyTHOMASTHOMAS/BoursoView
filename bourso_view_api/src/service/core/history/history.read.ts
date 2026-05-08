import type { ContextType as CT, ResponseType as RT } from "Shared/RouteType";
import { createMiddlewareError } from "MypkgAppsScript/ProcessRouter";
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

type HistoryPayload = Pick<CT.GetHistoryAction, "indices">;

/**
 * Clé composite `"ticker:start_date:end_date"` — identifie un segment de manière unique
 * même si le même ticker apparaît plusieurs fois avec des plages différentes.
 */
type SegmentKey = string;

type HistoryQueryItem = {
    /** Clé composite unique pour ce segment — utilisée pour indexer `futures` sans collision. */
    key: SegmentKey;
    ticker: string;
    start_date: string;
    end_date: string;
    period: CT.HistoryPeriod;
};

export default {
    get(payload: HistoryPayload): RT.GetHistoryAction {
        const requests = sanitizeIndices(payload.indices);
        if (requests.length === 0) return [];

        try {
            // ── Écriture des formules GOOGLEFINANCE (une colonne par segment) ─────
            requests.forEach((request, index) => {
                const colStart = (index * HISTORY_BLOCK_WIDTH) + 1;
                const startCell = `${numberToLetter(colStart - 1)}1`;
                const formula = buildGoogleFinanceHistoryFormula(
                    request.ticker,
                    request.start_date,
                    request.end_date,
                    request.period
                );

                sheetService.update.queueUpdateCell(HISTORY_TEMP_SHEET, startCell, formula);
            });

            sheetService.update.flush();
            SpreadsheetApp.flush();
            Utilities.sleep(HISTORY_CALC_WAIT_MS);

            // ── Lecture par clé composite pour éviter les collisions même-ticker ──
            const futures: Record<SegmentKey, ReturnType<typeof sheetService.read.queueGetValues<FinanceRow>>> = {};

            requests.forEach((request, index) => {
                const startCol = numberToLetter(index * HISTORY_BLOCK_WIDTH);
                const endCol = numberToLetter((index * HISTORY_BLOCK_WIDTH) + HISTORY_VALUE_COLUMNS - 1);
                const rangeA1 = `${startCol}1:${endCol}${HISTORY_MAX_ROWS}`;

                futures[request.key] = sheetService.read.queueGetValues<FinanceRow>(HISTORY_TEMP_SHEET, rangeA1);
            });

            sheetService.read.flush();

            // ── Construction du tableau de réponse (ordre respecté) ───────────────
            const data: RT.GetHistoryAction = requests.map((request) => {
                const rows = futures[request.key]?.get() ?? [];
                return {
                    ticker: request.ticker,
                    data: transformFinanceRows(rows),
                };
            });

            // ── Vérification des segments vides ───────────────────────────────────
            const emptyEntries = data.filter((entry) => entry.data.date.length === 0);
            if (emptyEntries.length > 0) {
                const emptyDetails = emptyEntries.map((entry) => {
                    const req = requests.find((r) => r.ticker === entry.ticker);
                    return {
                        ticker: entry.ticker,
                        googlefinance_formula: req
                            ? buildGoogleFinanceHistoryFormula(
                                req.ticker,
                                req.start_date,
                                req.end_date,
                                req.period
                              )
                            : "unknown"
                    };
                });

                throw createMiddlewareError("Aucune donnée historique trouvée pour un ou plusieurs indices", {
                    code: 404,
                    message: `Requêtes GOOGLEFINANCE sans données: ${JSON.stringify(emptyDetails)}`
                });
            }

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

/**
 * Nettoie et déduplique les indices demandés.
 *
 * La clé de déduplication est **composite** (`ticker:start_date:end_date`) :
 * deux segments du même ticker avec des plages différentes sont des entrées distinctes.
 * Seule la combinaison `ticker + start + end` identique est supprimée comme doublon.
 */
function sanitizeIndices(indices: CT.GetHistoryAction["indices"]): HistoryQueryItem[] {
    const seen = new Set<SegmentKey>();
    const cleaned: HistoryQueryItem[] = [];

    indices.forEach((item) => {
        const tickerValue = item.ticker.trim();
        if (!tickerValue) return;
        if (!item?.start_date || !item?.end_date) return;

        const compositeKey: SegmentKey = `${tickerValue}:${item.start_date}:${item.end_date}`;
        if (seen.has(compositeKey)) return;

        seen.add(compositeKey);
        cleaned.push({
            key: compositeKey,
            ticker: tickerValue,
            start_date: item.start_date,
            end_date: item.end_date,
            period: item.period ?? "DAILY"
        });
    });

    return cleaned;
}
