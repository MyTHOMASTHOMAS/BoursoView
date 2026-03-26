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
