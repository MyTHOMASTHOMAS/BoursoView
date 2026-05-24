/**
 * @file portfolioStats.ts
 * @description Fonctions mathématiques et de formatage pour la valorisation de portefeuille.
 *
 * Source unique de vérité pour toutes les opérations numériques du frontend :
 * - PnL, Méthode de Dietz Modifiée, référence ajustée
 * - Agrégats simples (investi total, fonds engagés)
 * - Formatage monétaire et pourcentages signés (locale FR)
 *
 * @remarks
 * Toutes les fonctions sont pures (sans effets de bord) et sans dépendances externes.
 * Les autres modules (dashboard, smart-display) importent directement depuis `src/utils/math`.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type PnLResult = {
    /** Montant absolu de la plus/moins-value. */
    absolute: number
    /** Variation relative en % (NaN si investissement = 0). */
    percent: number
}

export type PeriodDelta = {
    /** Delta absolu entre la valeur courante et la référence. */
    delta: number
    /** Delta relatif en %. */
    deltaPercent: number
}

// ─── Plus-value ───────────────────────────────────────────────────────────────

/**
 * Calcule la plus-value ou moins-value entre la valeur estimée et l'investi.
 *
 * @param estimated - Valeur liquidative estimée actuelle.
 * @param invested  - Montant total investi (prix + commissions + frais).
 */
export function computePnL(estimated: number, invested: number): PnLResult {
    const absolute = estimated - invested
    const percent = invested !== 0 ? (absolute / invested) * 100 : Number.NaN
    return { absolute, percent }
}

// ─── Variation brute ─────────────────────────────────────────────────────────

/**
 * Calcule la variation entre la valeur courante et une référence passée.
 *
 * @param current   - Valeur actuelle.
 * @param reference - Valeur de référence (J-1, J-7, J-30, etc.).
 */
export function computePeriodDelta(current: number, reference: number): PeriodDelta {
    const delta = current - reference
    const deltaPercent = reference !== 0 ? (delta / reference) * 100 : Number.NaN
    return { delta, deltaPercent }
}

// ─── Méthode de Dietz Modifiée ────────────────────────────────────────────────

/**
 * Calcule le rendement réel d'une période en neutralisant les apports de capital.
 * (Méthode de Dietz Modifiée — approximation du Time-Weighted Return)
 *
 * Sans cette correction, un achat de nouvelles positions fait artificiellement
 * grimper la performance de la période alors qu'il s'agit d'un flux entrant.
 *
 * Formule :
 *   R = (V_fin − V_début − CF) / (V_début + CF × 0.5)
 *
 * Hypothèse simplificatrice : les flux arrivent en milieu de période (poids = 0.5).
 * Sentinelle « pas de données » : si `estimatedStart === 0 && investStart === 0`,
 * la période n'existe pas encore (ex: `y1` quand le portefeuille a < 1 an).
 *
 * @param estimatedEnd   - Valeur estimée en fin de période (aujourd'hui).
 * @param estimatedStart - Valeur estimée en début de période (J-1, J-7, J-30...).
 * @param investEnd      - Montant total investi en fin de période.
 * @param investStart    - Montant total investi en début de période.
 *
 * @example
 * computeModifiedDietz(2912.91, 2492.64, 2609.44, 2368.63)
 * // → { delta: 179.46, deltaPercent: 6.87 }  (vs +16.9 % sans correction)
 */
export function computeModifiedDietz(
    estimatedEnd: number,
    estimatedStart: number,
    investEnd: number,
    investStart: number,
): PeriodDelta {
    if (estimatedStart === 0 && investStart === 0) {
        return { delta: Number.NaN, deltaPercent: Number.NaN }
    }
    const cashFlow = investEnd - investStart
    const delta = estimatedEnd - estimatedStart - cashFlow
    const denominator = estimatedStart + cashFlow * 0.5
    const deltaPercent = denominator !== 0 ? (delta / denominator) * 100 : Number.NaN
    return { delta, deltaPercent }
}

/**
 * Calcule une référence de prix ajustée telle que :
 *   (estimatedCurrent − adjRef) / adjRef  ==  r_dietz
 *
 * Utilisée pour passer à `trendVisualFromVariance` (gradient de couleur) une référence
 * qui produit le même % que le calcul Dietz — sans biais des apports.
 *
 * Formule : adjRef = estimatedCurrent / (1 + r_dietz)
 *
 * @param estimatedCurrent - Valeur estimée actuelle.
 * @param estimatedRef     - Valeur estimée à la date de référence.
 * @param investCurrent    - Montant total investi actuel.
 * @param investRef        - Montant total investi à la date de référence.
 */
export function computeAdjustedPriceReference(
    estimatedCurrent: number,
    estimatedRef: number,
    investCurrent: number,
    investRef: number,
): number {
    const { deltaPercent } = computeModifiedDietz(estimatedCurrent, estimatedRef, investCurrent, investRef)
    if (Number.isNaN(deltaPercent)) return estimatedRef
    const r = deltaPercent / 100
    if (r <= -1) return estimatedRef
    return estimatedCurrent / (1 + r)
}

// ─── Agrégats ────────────────────────────────────────────────────────────────

/**
 * Calcule le montant total investi : prix des titres + commissions + frais.
 */
export function computeTotalInvested(price: number, commission: number, fee: number): number {
    return price + commission + fee
}

/**
 * Calcule les fonds engagés (versements − liquidités disponibles).
 */
export function computeEngaged(total: number, available: number): number {
    return total - available
}

// ─── Formatage ────────────────────────────────────────────────────────────────

/**
 * Formate un montant monétaire (locale FR, sans symbole €).
 *
 * @param amount   - Montant à formater.
 * @param decimals - Nombre de décimales (défaut : 2).
 */
export function format(amount: number, decimals = 2): string {
    return amount.toLocaleString('fr-FR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })
}

/**
 * Formate un pourcentage avec signe explicite et décimales.
 * Retourne '—' si la valeur n'est pas finie (sentinelle « pas de données »).
 *
 * @param percent  - Valeur en pourcentage.
 * @param decimals - Nombre de décimales (défaut : 2).
 */
export function formatSignedPercent(percent: number, decimals = 2): string {
    if (!Number.isFinite(percent)) return '—'
    const sign = percent >= 0 ? '+' : ''
    return `${sign}${percent.toFixed(decimals)} %`
}

/**
 * Formate une valeur numérique avec signe explicite (sans unité monétaire).
 * Retourne '—' si la valeur n'est pas finie (sentinelle « pas de données »).
 *
 * @param value    - Montant ou delta brut.
 * @param decimals - Nombre de décimales (défaut : 2).
 */
export function formatSignedNumber(value: number, decimals = 2): string {
    if (!Number.isFinite(value)) return '—'
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(decimals)}`
}

/**
 * Formate un montant avec signe explicite (locale FR, sans symbole €).
 *
 * @param amount   - Montant (peut être négatif).
 * @param decimals - Nombre de décimales (défaut : 2).
 */
export function formatSignedEur(amount: number, decimals = 2): string {
    const sign = amount >= 0 ? '+' : ''
    return `${sign}${format(amount, decimals)}`
}
