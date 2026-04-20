import { NVB } from "MypkgTypescript/Validator";

export const getTransactionsAction = NVB()
    .isRequired()
    .isObject({
        objSchema: {
            authToken: NVB().isRequired().isString(),
            limit: NVB().isRequired().isNumber(),
            offset: NVB().isRequired().isNumber()
        }
    });

export const createTransactionAction = NVB()
    .isRequired()
    .isObject({
        objSchema: {
            authToken: NVB().isRequired().isString(),
            id: NVB().isRequired().isString(),
            date: NVB().isRequired().isString(),
            price: NVB().isRequired().isNumber(),
            nb: NVB().isRequired().isNumber(),
            commission: NVB().isRequired().isNumber(),
            fee: NVB().isRequired().isNumber()
        }
    });

export const deleteTransactionAction = NVB()
    .isRequired()
    .isObject({
        objSchema: {
            authToken: NVB().isRequired().isString(),
            line: NVB().isRequired().isNumber()
        }
    });
