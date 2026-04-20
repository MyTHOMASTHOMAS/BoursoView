/**
 * Ligne transaction renvoyee par l'API.
 */
export type TransactionItem = {
    id: string;
    titre: string;
    date: string;
    price: number;
    nb: number;
    commission: number;
    fee: number;
    pru: number;
    total: number;
    _line: number;
};

/**
 * Type de reponse pour la route getTransactions.
 */
export type GetTransactionsAction = {
    transactions: TransactionItem[];
};

/**
 * Type de reponse pour la route createTransaction.
 */
export type CreateTransactionAction = {
    createdCount: number;
};

/**
 * Type de reponse pour la route deleteTransaction.
 */
export type DeleteTransactionAction = {
    deleted: boolean;
};
