/**
 * Total agrege des transactions d'un referentiel.
 */
export type TransactionTotal = {
    id: string;
    price: number;
    nb: number;
    comission: number;
    fee: number;
    pru: number;
    total_invested: number;
    estimated: number;
    estimated_j_1: number;
    estimated_j_7: number;
    estimated_1_mois: number;
    estimated_6_mois: number;
    estimated_1_an: number;
};

/**
 * Total agrege des dividendes d'un referentiel.
 */
export type DividendeTotal = {
    id: number;
    amount_brut: number;
    taxe: number;
    commission: number;
    amount_net: number;
};

/**
 * Ligne referentiel renvoyee par l'API.
 */
export type ReferentielItem = {
    id: string;
    name: string;
    isin: string;
    management_fee: number;
    price: number;
    estimated_j_1: number;
    estimated_j_7: number;
    estimated_1_mois: number;
    estimated_6_mois: number;
    estimated_1_an: number;
    totals: {
        transaction: TransactionTotal;
        dividende: DividendeTotal;
    };
    _line: number;
};

/**
 * Type de reponse pour la route getReferentiel.
 */
export type GetReferentielAction = {
    referentiels: ReferentielItem[];
};

/**
 * Type de reponse pour la route createReferentiel.
 */
export type CreateReferentielAction = {
    createdCount: number;
};

/**
 * Type de reponse pour la route deleteReferentiel.
 */
export type DeleteReferentielAction = {
    deleted: boolean;
};
