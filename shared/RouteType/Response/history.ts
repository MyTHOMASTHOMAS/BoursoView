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
 * Entree de reponse pour un segment ticker + plage de dates.
 * Chaque entree correspond a un element du tableau `indices` de la requete.
 */
export type TickerHistoryEntry = {
    ticker: string;
    data: TickerData;
};

/**
 * Type de reponse pour la route getHistory.
 * Tableau ordonne de la meme facon que le tableau `indices` de la requete.
 */
export type GetHistoryAction = TickerHistoryEntry[];
