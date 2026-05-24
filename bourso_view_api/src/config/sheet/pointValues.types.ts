import type { Position } from "MypkgAppsScript/SheetsService/src/SheetServiceTypes";

/**
 * Valeur brute retournée par Google Sheets pour une cellule.
 */
export type SheetCellValue = string | number | boolean | Date | null | undefined;

/**
 * Définition d'une valeur ponctuelle à lire sur une feuille.
 */
export type PointValueFieldConfig<TResult = SheetCellValue> = {
    /** Position [colonne, ligne] en 0-based (ex. [0, 0] = A1). */
    position: Position;
    /** Surcharge le nom de feuille par défaut passé à {@link readPointValues}. */
    sheetName?: string;
    /** Conversion optionnelle de la valeur brute lue. */
    convert?: (raw: unknown) => TResult;
};

/**
 * Configuration de lecture : clé métier → cellule + conversion optionnelle.
 *
 * @example
 * ```ts
 * const RESUME_CONFIG = {
 *   total_fund: {
 *     position: [2, 4],
 *     convert: (raw) => Number(raw) || 0
 *   }
 * } satisfies PointValuesReadConfig;
 * ```
 */
export type PointValuesReadConfig = Record<string, PointValueFieldConfig<unknown>>;

/** Contrainte alignée sur {@link PointValuesReadConfig} (`unknown`, pas le défaut `SheetCellValue`). */
type InferPointValueField<C extends PointValueFieldConfig<unknown>> =
    C extends PointValueFieldConfig<infer TResult> ? TResult : SheetCellValue;

/**
 * Objet résultat typé à partir de la configuration.
 */
export type PointValuesReadResult<T extends PointValuesReadConfig> = {
    [K in keyof T]: InferPointValueField<T[K]>;
};
