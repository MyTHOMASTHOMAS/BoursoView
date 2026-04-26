import { NVB } from "MypkgTypescript/Validator";

/**
 * Validateur pour la route getHistory
 */
export const getHistoryAction = NVB()
    .isRequired()
    .isObject({
        objSchema: {
            authToken: NVB().isRequired().isString(),
            indices: NVB().isArray().isRequired(),
            start_date: NVB().isRequired().isString(),
            end_date: NVB().isRequired().isString(),
            period: NVB().isString().isEqual(["DAILY", "WEEKLY"])
        }
    });
