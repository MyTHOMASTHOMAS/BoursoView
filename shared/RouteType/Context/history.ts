/**
 * Periode de recuperation des donnees historiques.
 */
export type HistoryPeriod = "DAILY" | "WEEKLY";

type GetIndiceParams = {
    ticker: string;
    start_date: string;
    end_date: string;
    period?: HistoryPeriod;
}


/**
 * Type pour le contexte de la route getHistory
 */
export type GetHistoryAction = {
    authToken: string;
    indices: Array<GetIndiceParams>;
};
