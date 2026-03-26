/**
 * Ligne achat renvoyee par l'API.
 */
export type AchatItem = {
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
 * Type de reponse pour la route getAchats.
 */
export type GetAchatAction = {
    achats: AchatItem[];
};

/**
 * Type de reponse pour la route createAchat.
 */
export type CreateAchatAction = {
    createdCount: number;
};

/**
 * Type de reponse pour la route deleteAchat.
 */
export type DeleteAchatAction = {
    deleted: boolean;
};
