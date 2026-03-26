import {NVB} from "MypkgTypescript/Validator";

/**
 * Validateur pour la route auth
 * Requiert un token d'authentification dans le body
 */
export const authAction = NVB()
    .isRequired()
    .isObject({
        objSchema: {
            authToken: NVB().isRequired().isString()
        }
    });