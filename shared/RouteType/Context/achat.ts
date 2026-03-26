/**
 * Type pour le contexte de la route getAchats
 */
export type GetAchatsAction = {
    authToken: string;
    limit: number;
    offset: number;
};

/**
 * Type pour le contexte de la route createAchat
 */
export type CreateAchatAction = {
    authToken: string;
    id: string;
    date: string;
    price: number;
    nb: number;
    commission: number;
    fee: number;
};

/**
 * Type pour le contexte de la route deleteAchat
 */
export type DeleteAchatAction = {
    authToken: string;
    line: number;
};
