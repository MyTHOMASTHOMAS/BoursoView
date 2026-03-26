/**
 * Ligne referentiel renvoyee par l'API.
 */
export type ReferentielItem = {
    id: string;
    name: string;
    isin: string;
    management_fee: number;
    price: number;
    _line: number;
};

/**
 * Type de reponse pour la route getReferentiel.
 */
export type GetReferentielAction = {
    referentiels: ReferentielItem[];
};
