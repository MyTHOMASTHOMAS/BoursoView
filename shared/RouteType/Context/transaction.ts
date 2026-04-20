/**
 * Type pour le contexte de la route getTransactions
 */
export type GetTransactionsAction = {
    authToken: string;
    limit: number;
    offset: number;
};

/**
 * Type pour le contexte de la route createTransaction
 */
export type CreateTransactionAction = {
    authToken: string;
    id: string;
    date: string;
    price: number;
    nb: number;
    commission: number;
    fee: number;
};

/**
 * Type pour le contexte de la route deleteTransaction
 */
export type DeleteTransactionAction = {
    authToken: string;
    line: number;
};
