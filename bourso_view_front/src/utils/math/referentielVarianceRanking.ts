/**
 * @file referentielVarianceRanking.ts
 * @description Classement des référentiels par écart de variation (dashboard).
 *
 * Compare les horizons affichés dans `PriceTrendHoverCard` (1j, 7j, ~1 mois)
 * via {@link getVarianceGradientIndex}, puis retient ceux dont l'écart au neutre
 * (indice 0,5) est le plus marqué — à surveiller en priorité.
 */
import type { ResponseType as RT } from 'Shared/RouteType'
import { getVarianceGradientIndex } from './varianceGradientIndex'

/**
 * Horizon de référence pour la pondération temps (√ segment / horizon).
 * Aligné sur `PRICE_TREND_REF_HORIZON_DAYS` (`price-trend-snapshot/constants.ts`).
 */
export const REFERENTIEL_TREND_REF_HORIZON_DAYS = 30

const REFERENTIEL_VARIANCE_HORIZONS = [
    { segmentDays: 1, getReference: (r: RT.ReferentielItem) => r.estimated_j_1 },
    { segmentDays: 7, getReference: (r: RT.ReferentielItem) => r.estimated_j_7 },
    { segmentDays: 30, getReference: (r: RT.ReferentielItem) => r.estimated_1_mois },
] as const

/**
 * Distance normalisée à l'indice neutre **0,5** — **0** = stable, **1** = saturé (extrême).
 */
export function varianceGradientGapFromIndice(indice: number): number {
    return Math.abs(indice - 0.5) * 2
}

/**
 * Score d'écart maximal sur les trois horizons (1j, 7j, 1 mois) pour un référentiel.
 *
 * @param referentiel — Ligne API `getReferentiel`.
 * @param variance — Amplitude relative attendue (ex. `defaultVariance` du store).
 * @returns Nombre dans **[0, 1]** ; plus élevé = variation plus marquée à surveiller.
 */
export function computeReferentielVarianceGapScore(
    referentiel: RT.ReferentielItem,
    variance: number,
): number {
    const price = referentiel.price
    let maxGap = 0

    for (const { segmentDays, getReference } of REFERENTIEL_VARIANCE_HORIZONS) {
        const reference = getReference(referentiel)
        const indice = getVarianceGradientIndex(
            reference,
            price,
            variance,
            segmentDays,
            REFERENTIEL_TREND_REF_HORIZON_DAYS,
        )
        maxGap = Math.max(maxGap, varianceGradientGapFromIndice(indice))
    }

    return maxGap
}

export type RankedReferentiel = {
    referentiel: RT.ReferentielItem
    /** Score renvoyé par {@link computeReferentielVarianceGapScore}. */
    varianceGapScore: number
}

/**
 * Trie les référentiels par score d'écart décroissant (égalité → ordre alphabétique sur `id`).
 */
export function rankReferentielsByVarianceGap(
    referentiels: RT.ReferentielItem[],
    variance: number,
): RankedReferentiel[] {
    return referentiels
        .map((referentiel) => ({
            referentiel,
            varianceGapScore: computeReferentielVarianceGapScore(referentiel, variance),
        }))
        .sort((a, b) => {
            const scoreDiff = b.varianceGapScore - a.varianceGapScore
            if (scoreDiff !== 0) return scoreDiff
            return a.referentiel.id.localeCompare(b.referentiel.id)
        })
}

/**
 * Retourne les `limit` référentiels les plus « intéressants » à regarder sur le dashboard.
 */
export function pickTopReferentielsByVarianceGap(
    referentiels: RT.ReferentielItem[],
    limit: number,
    variance: number,
): RT.ReferentielItem[] {
    if (limit <= 0) return []
    return rankReferentielsByVarianceGap(referentiels, variance)
        .slice(0, limit)
        .map((entry) => entry.referentiel)
}
