/**
 * Série temporelle (lignes 8 et 10 : current, j1, j7, j30, m6, y1).
 */
export type ResumeTimeSeriesValues = {
    current: number;
    j1: number;
    j7: number;
    j30: number;
    m6: number;
    y1: number;
};

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
