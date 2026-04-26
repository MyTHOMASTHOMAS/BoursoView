/**
 * Periode de recuperation des donnees historiques.
 */
export type HistoryPeriod = "DAILY" | "WEEKLY";

/**
 * Type pour le contexte de la route getHistory
 */
export type GetHistoryAction = {
    authToken: string;
    indices: string[];
    start_date: string;
    end_date: string;
    period?: HistoryPeriod;
};
