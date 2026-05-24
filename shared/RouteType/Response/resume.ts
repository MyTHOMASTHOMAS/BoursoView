import type { ResumeTimeSeriesValues } from "./timeSeries";

export type { ResumeTimeSeriesValues } from "./timeSeries";

/**
 * Bloc transactions du résumé portefeuille.
 */
export type ResumeTransaction = {
    count: number;
    price: number;
    nb: number;
    comission: number;
    fee: number;
    pru: number;
    total: {
        invest: ResumeTimeSeriesValues;
        estimated: ResumeTimeSeriesValues;
    };
};

/**
 * Bloc dividendes du résumé portefeuille.
 */
export type ResumeDividendes = {
    count: number;
    amount_brut: number;
    taxe: number;
    comission: number;
    amount_net: number;
};

/**
 * Réponse de la route getResume.
 */
export type GetResumeAction = {
    fund: {
        total: number;
        available: number;
    };
    transaction: ResumeTransaction;
    dividendes: ResumeDividendes;
};
