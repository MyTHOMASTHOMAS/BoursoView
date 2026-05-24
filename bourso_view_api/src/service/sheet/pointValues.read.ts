import { positionToA1 } from "MypkgAppsScript/SheetsService";
import type { FutureResult } from "MypkgAppsScript/SheetsService";
import { sheetService } from "../sheet";
import type {
    PointValuesReadConfig,
    PointValuesReadResult
} from "../../config/sheet/pointValues.types";

/**
 * Lit des valeurs ponctuelles sur une feuille Google Sheets à partir d'une configuration.
 *
 * Toutes les lectures sont regroupées en un seul batch (`flush`) comme pour l'auth
 * ou l'historique.
 *
 * @param defaultSheetName - Nom de l'onglet par défaut pour les champs sans `sheetName`.
 * @param config - Map clé → `{ position, sheetName?, convert? }`.
 * @returns Objet `{ [clé]: valeur }` avec conversions appliquées si définies.
 *
 * @example
 * ```ts
 * const resume = readPointValues("Resume", {
 *   total_fund: {
 *     position: [2, 4],
 *     convert: (raw) => Number(raw) || 0
 *   },
 *   last_update: {
 *     position: [2, 5],
 *     convert: (raw) =>
 *       typeof raw === "number" ? googleSerialToDate(raw).toISOString() : String(raw)
 *   }
 * });
 * // { total_fund: 12345.67, last_update: "2026-05-24T..." }
 * ```
 */
export function readPointValues<T extends PointValuesReadConfig>(
    defaultSheetName: string,
    config: T
): PointValuesReadResult<T> {
    const keys = Object.keys(config) as (keyof T & string)[];
    if (keys.length === 0) {
        return {} as PointValuesReadResult<T>;
    }

    const futures: Record<string, FutureResult<unknown>> = {};

    for (const key of keys) {
        const field = config[key];
        const sheetName = field.sheetName ?? defaultSheetName;
        const cellA1 = positionToA1(field.position);
        const transformer = field.convert
            ? (raw: unknown) => field.convert!(raw)
            : undefined;

        futures[key] = sheetService.read.queueGetValue(
            sheetName,
            cellA1,
            transformer
        );
    }

    sheetService.read.flush();

    const result = {} as PointValuesReadResult<T>;
    for (const key of keys) {
        result[key as keyof T] = futures[key].get() as PointValuesReadResult<T>[keyof T];
    }

    return result;
}
