import type { ResponseType as RT } from "Shared/RouteType";
import { RESUME_SHEET_NAME } from "../../../config/sheet/resume.constants";
import { RESUME_POINT_VALUES_CONFIG } from "../../../config/sheet/resume.pointValues";
import { readPointValues } from "../../sheet/pointValues.read";

type ResumeRaw = ReturnType<typeof readResumeRaw>;

function readResumeRaw() {
    return readPointValues(RESUME_SHEET_NAME, RESUME_POINT_VALUES_CONFIG);
}

function mapTimeSeries(
    raw: ResumeRaw,
    prefix: "transactions_invest" | "transactions_estimated"
): RT.ResumeTimeSeriesValues {
    return {
        current: raw[`${prefix}_current`],
        j1: raw[`${prefix}_j1`],
        j7: raw[`${prefix}_j7`],
        j30: raw[`${prefix}_j30`],
        m6: raw[`${prefix}_m6`],
        y1: raw[`${prefix}_y1`]
    };
}

function mapToResumeResponse(raw: ResumeRaw): RT.GetResumeAction {
    return {
        fund: {
            total: raw.fund_total,
            available: raw.fund_available
        },
        transaction: {
            count: raw.transactions_count,
            price: raw.transactions_price,
            nb: raw.transactions_nb,
            comission: raw.transactions_comission,
            fee: raw.transactions_fee,
            pru: raw.transactions_pru,
            total: {
                invest: mapTimeSeries(raw, "transactions_invest"),
                estimated: mapTimeSeries(raw, "transactions_estimated")
            }
        },
        dividendes: {
            count: raw.dividendes_count,
            amount_brut: raw.dividendes_amount_brut,
            taxe: raw.dividendes_taxe,
            comission: raw.dividendes_comission,
            amount_net: raw.dividendes_amount_net
        }
    };
}

export default {
    get(): RT.GetResumeAction {
        return mapToResumeResponse(readResumeRaw());
    }
};
