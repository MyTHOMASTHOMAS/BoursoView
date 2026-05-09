/**
 * Ligne fund renvoyee par l'API.
 */
export type FundItem = {
    date: string;
    montant: number;
    total: number;
    _line: number;
};

/**
 * Type de reponse pour la route getFunds.
 */
export type GetFundsAction = {
    funds: FundItem[];
};

/**
 * Type de reponse pour la route createFund.
 */
export type CreateFundAction = {
    createdCount: number;
};

/**
 * Type de reponse pour la route deleteFund.
 */
export type DeleteFundAction = {
    deleted: boolean;
};
