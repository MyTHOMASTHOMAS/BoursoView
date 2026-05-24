import type { Position } from "MypkgAppsScript/SheetsService/src/SheetServiceTypes";
import type { PointValuesReadConfig } from "./pointValues.types";
import { toSheetNumber } from "../../utils/conversion/pointValueConverters";

/**
 * Positions des cellules du résumé (notation A1 → [col, row] 0-based).
 */
export const RESUME_POINT_VALUES_CONFIG = {
    fund_total: { position: [1, 1] as Position, convert: toSheetNumber },
    fund_available: { position: [3, 1] as Position, convert: toSheetNumber },

    transactions_count: { position: [0, 5] as Position, convert: toSheetNumber },
    transactions_price: { position: [1, 5] as Position, convert: toSheetNumber },
    transactions_nb: { position: [2, 5] as Position, convert: toSheetNumber },
    transactions_comission: { position: [3, 5] as Position, convert: toSheetNumber },
    transactions_fee: { position: [4, 5] as Position, convert: toSheetNumber },
    transactions_pru: { position: [5, 5] as Position, convert: toSheetNumber },

    transactions_invest_current: { position: [0, 7] as Position, convert: toSheetNumber },
    transactions_invest_j1: { position: [1, 7] as Position, convert: toSheetNumber },
    transactions_invest_j7: { position: [2, 7] as Position, convert: toSheetNumber },
    transactions_invest_j30: { position: [3, 7] as Position, convert: toSheetNumber },
    transactions_invest_m6: { position: [4, 7] as Position, convert: toSheetNumber },
    transactions_invest_y1: { position: [5, 7] as Position, convert: toSheetNumber },

    transactions_estimated_current: { position: [0, 9] as Position, convert: toSheetNumber },
    transactions_estimated_j1: { position: [1, 9] as Position, convert: toSheetNumber },
    transactions_estimated_j7: { position: [2, 9] as Position, convert: toSheetNumber },
    transactions_estimated_j30: { position: [3, 9] as Position, convert: toSheetNumber },
    transactions_estimated_m6: { position: [4, 9] as Position, convert: toSheetNumber },
    transactions_estimated_y1: { position: [5, 9] as Position, convert: toSheetNumber },

    dividendes_count: { position: [0, 13] as Position, convert: toSheetNumber },
    dividendes_amount_brut: { position: [1, 13] as Position, convert: toSheetNumber },
    dividendes_taxe: { position: [2, 13] as Position, convert: toSheetNumber },
    dividendes_comission: { position: [3, 13] as Position, convert: toSheetNumber },
    dividendes_amount_net: { position: [4, 13] as Position, convert: toSheetNumber }
} satisfies PointValuesReadConfig;
