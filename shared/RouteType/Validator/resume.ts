import { NVB } from "MypkgTypescript/Validator";

/**
 * Validateur pour la route getResume.
 */
export const getResumeAction = NVB()
    .isRequired()
    .isObject({
        objSchema: {
            authToken: NVB().isRequired().isString()
        }
    });
