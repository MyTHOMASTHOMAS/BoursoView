import { NVB } from "MypkgTypescript/Validator";

/**
 * Validateur pour la route getReferentiel
 * Requiert un token d'authentification dans le body
 */
export const getReferentielAction = NVB()
    .isRequired()
    .isObject({
        objSchema: {
            authToken: NVB().isRequired().isString()
        }
    });

export const createReferentielAction = NVB()
    .isRequired()
    .isObject({
        objSchema: {
            authToken: NVB().isRequired().isString(),
            id: NVB().isRequired().isString(),
            name: NVB().isRequired().isString(),
            isin: NVB().isRequired().isString(),
            management_fee: NVB().isRequired().isNumber()
        }
    });

export const deleteReferentielAction = NVB()
    .isRequired()
    .isObject({
        objSchema: {
            authToken: NVB().isRequired().isString(),
            line: NVB().isRequired().isNumber()
        }
    });
