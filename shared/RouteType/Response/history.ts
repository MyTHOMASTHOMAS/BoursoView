/**
 * Donnees historiques d'un indice.
 */
export type TickerData = {
    date: string[];
    open: number[];
    high: number[];
    low: number[];
    close: number[];
    volume: number[];
};

/**
 * Type de reponse pour la route getHistory.
 */
export type GetHistoryAction = Record<string, TickerData>;
