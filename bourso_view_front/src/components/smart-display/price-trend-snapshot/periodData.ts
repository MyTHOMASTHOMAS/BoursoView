/**
 * Sentinelle « pas de données » pour une période (référence à 0).
 */
export function hasPricePeriodData(reference: number): boolean {
    return reference !== 0
}

export function hasPortfolioPeriodData(estimatedRef: number, investRef: number): boolean {
    return !(estimatedRef === 0 && investRef === 0)
}
