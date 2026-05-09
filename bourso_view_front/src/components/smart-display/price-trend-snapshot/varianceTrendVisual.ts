import { calculateMultiColor } from 'MypkgTypescript/ColorManager/src/service/gradient.ts'
import { getVarianceGradientIndex, isVarianceGradientExtreme } from '../../../utils/math'
import { PRICE_TREND_GRADIENT_HEX, PRICE_TREND_REF_HORIZON_DAYS } from './constants'

/**
 * Sortie de `trendVisualFromVariance` : indice normalisé, couleur du gradient et angle de flèche associés.
 */
export type VarianceTrendVisual = {
    /** Position dans [0, 1] pour le gradient (voir `getVarianceGradientIndex`). */
    indice: number
    /** Couleur HEX interpolée sur `PRICE_TREND_GRADIENT_HEX`. */
    color: string
    /** Rotation SVG en degrés : ~0° hausse forte, ~180° baisse forte, ~90° neutre. */
    arrowRotationDeg: number
    /**
     * Indice saturé (**0** ou **1**) : mouvement au-delà de l’échelle de variance → UI peut clignoter (`animate-variance-extreme`).
     */
    isExtreme: boolean
}

/**
 * À partir du prix de référence et du prix actuel, calcule l’indice de variance, la couleur et la rotation de flèche.
 *
 * Réutilise la même horizon et palette que `QuickTrendCurve` (`constants.ts`).
 *
 * @param reference — `priceStart` : prix au début du segment (ex. veille, J-7).
 * @param price — `priceEnd` : prix à la date observée (souvent le spot).
 * @param variance — Amplitude relative attendue (ex. 0.2 pour ±20 %).
 * @param segmentDays — Taille du segment en jours pour la pondération temps (√ segment / horizon).
 * @returns Objet `VarianceTrendVisual` prêt pour les styles inline et `DirectionArrowIcon`.
 */
export function trendVisualFromVariance(
    reference: number,
    price: number,
    variance: number,
    segmentDays: number
): VarianceTrendVisual {
    const indice = getVarianceGradientIndex(
        reference,
        price,
        variance,
        segmentDays,
        PRICE_TREND_REF_HORIZON_DAYS
    )
    const color = calculateMultiColor(PRICE_TREND_GRADIENT_HEX, indice)
    // Cartographie linéaire indice → rotation : haut = hausse (indice élevé).
    const arrowRotationDeg = 180 * (1 - indice)
    const isExtreme = isVarianceGradientExtreme(indice)
    return { indice, color, arrowRotationDeg, isExtreme }
}
