import { NVB } from "MypkgTypescript/Validator";

export const getFundsAction = NVB()
    .isRequired()
    .isObject({
        objSchema: {
            authToken: NVB().isRequired().isString(),
            limit: NVB().isRequired().isNumber(),
            offset: NVB().isRequired().isNumber()
        }
    });

export const createFundAction = NVB()
    .isRequired()
    .isObject({
        objSchema: {
            authToken: NVB().isRequired().isString(),
            date: NVB().isRequired().isString(),
            montant: NVB().isRequired().isNumber()
        }
    });

export const deleteFundAction = NVB()
    .isRequired()
    .isObject({
        objSchema: {
            authToken: NVB().isRequired().isString(),
            line: NVB().isRequired().isNumber()
        }
    });
