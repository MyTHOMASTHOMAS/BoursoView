/**
 * Type pour le contexte de la route getFunds
 */
export type GetFundsAction = {
    authToken: string;
    limit: number;
    offset: number;
};

/**
 * Type pour le contexte de la route createFund
 */
export type CreateFundAction = {
    authToken: string;
    date: string;
    montant: number;
};

/**
 * Type pour le contexte de la route deleteFund
 */
export type DeleteFundAction = {
    authToken: string;
    line: number;
};
