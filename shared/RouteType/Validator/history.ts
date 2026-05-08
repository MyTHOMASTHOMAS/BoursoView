import { NVB } from "MypkgTypescript/Validator";

/**
 * Validateur pour la route getHistory
 */
export const getHistoryAction = NVB()
    .isRequired()
    .isObject({
        objSchema: {
            authToken: NVB().isRequired().isString(),
            indices: NVB()
                .isRequired()
                .isArray()
                .addRule({
                    fn: (value) => {
                        if (!Array.isArray(value)) {
                            return false;
                        }

                        if (value.length === 0) return false;

                        return value.every((item) => {
                            if (!item || typeof item !== "object" || Array.isArray(item)) return false;

                            const indiceParams = item as {
                                ticker?: unknown;
                                start_date?: unknown;
                                end_date?: unknown;
                                period?: unknown;
                            };

                            const hasValidTicker = typeof indiceParams.ticker === "string" && indiceParams.ticker.trim().length > 0;
                            const hasValidStartDate = typeof indiceParams.start_date === "string" && indiceParams.start_date.trim().length > 0;
                            const hasValidEndDate = typeof indiceParams.end_date === "string" && indiceParams.end_date.trim().length > 0;
                            const hasValidPeriod =
                                indiceParams.period === undefined ||
                                indiceParams.period === "DAILY" ||
                                indiceParams.period === "WEEKLY";

                            return hasValidTicker && hasValidStartDate && hasValidEndDate && hasValidPeriod;
                        });
                    }
                })
        }
    });
