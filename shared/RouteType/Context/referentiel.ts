/**
 * Type pour le contexte de la route getReferentiel
 */
export type GetReferentielAction = {
    authToken: string;
};

/**
 * Type pour le contexte de la route createReferentiel
 */
export type CreateReferentielAction = {
    authToken: string;
    id: string;
    name: string;
    isin: string;
    management_fee: number;
};

/**
 * Type pour le contexte de la route deleteReferentiel
 */
export type DeleteReferentielAction = {
    authToken: string;
    line: number;
};
