import { useMemo } from 'react'
import { calculateMultiColor } from 'MypkgTypescript/ColorManager/src/service/gradient.ts'
import { getVarianceGradientIndex, isVarianceGradientExtreme } from '../../../utils/math'
import { TrendArrowIcon } from '../../icons/TrendArrowIcon'
import {
    PRICE_TREND_GRADIENT_HEX,
    PRICE_TREND_REF_HORIZON_DAYS,
    REAL_DAYS_J1_TO_NOW,
    REAL_DAYS_J30_TO_J7,
    REAL_DAYS_J7_TO_J1
} from './constants'

/**
 * Couleur interpolée + indice [0, 1] renvoyés par `segmentColorFromVariance`.
 */
export type SegmentGradientTuple = readonly [color: string, indice: number]

/**
 * Combine `getVarianceGradientIndex` et `calculateMultiColor` pour un segment donné.
 *
 * Utile pour réutiliser la même logique que le fond du sparkline avec un autre tableau de couleurs.
 *
 * @param priceStart — Début du segment (ex. prix à J-30).
 * @param priceEnd — Fin du segment (ex. prix à J-7).
 * @param variance — Amplitude relative attendue (ex. 0.2).
 * @param gradientColors — Liste HEX pour l’interpolation (souvent `PRICE_TREND_GRADIENT_HEX`).
 * @param segmentRealDays — Durée du segment en jours (voir `constants.ts`).
 * @returns Tuple `[couleur HEX, indice clampé]`.
 */
export function segmentColorFromVariance(
    priceStart: number,
    priceEnd: number,
    variance: number,
    gradientColors: string[],
    segmentRealDays: number
): SegmentGradientTuple {
    const indice = getVarianceGradientIndex(
        priceStart,
        priceEnd,
        variance,
        segmentRealDays,
        PRICE_TREND_REF_HORIZON_DAYS
    )
    const calculatedColor = calculateMultiColor(gradientColors, indice)
    return [calculatedColor, indice] as const
}

/**
 * Ajoute deux caractères alpha hex à une couleur `#RRGGBB` pour les fonds SVG semi-transparents.
 *
 * @param hex — Couleur sur 7 caractères (`#` + 6 hex).
 * @param alphaHex — Composante alpha sur 2 hex (ex. `CC` ≈ 80 % d’opacité).
 */
function hexWithAlpha(hex: string, alphaHex = 'CC'): string {
    if (hex.startsWith('#') && hex.length === 7) {
        return `${hex}${alphaHex}`
    }
    return hex
}

/**
 * Props du mini sparkline à quatre points (alignés sur les références « mois / semaine / jour / spot »).
 */
type QuickTrendCurveProps = {
    /** Prix à ~30 jours (point gauche et référence min/max verticaux). */
    price_30_j: number
    /** Prix à ~7 jours. */
    price_7_j: number
    /** Prix à ~1 jour. */
    price_1_j: number
    /** Prix actuel (extrémité droite). */
    price_0_j: number
    /** Largeur du SVG en px. @defaultValue 32 */
    width?: number
    /** Hauteur du SVG en px. @defaultValue 26 */
    height?: number
    /** Couleur du tracé principal (`currentColor` pour hériter du texte). */
    color?: string
    /** Épaisseur du contour du tracé. */
    strokeWidth?: number
    /**
     * Demi-bande verticale autour du prix 30j : la courbe est clampée dans
     * `[price_30_j × (1 − x), price_30_j × (1 + x)]` puis étendue aux extrêmes réels des quatre points.
     * @defaultValue 0.2 (±20 %).
     */
    maxVariancePercent?: number
}

/**
 * Sparkline compact : quatre valeurs reliées dans `TrendArrowIcon`, avec trois bandes de fond
 * colorées par segment via `segmentColorFromVariance` (mémoïsé pour limiter les appels ColorManager).
 */
export function QuickTrendCurve({
    price_30_j,
    price_7_j,
    price_1_j,
    price_0_j,
    width = 32,
    height = 26,
    color = 'currentColor',
    strokeWidth = 0,
    maxVariancePercent = 0.2
}: QuickTrendCurveProps) {
    // Fenêtre verticale « attendue » puis élargie aux pics réels pour éviter de clipper la courbe.
    const minY = price_30_j * (1 - maxVariancePercent)
    const maxY = price_30_j * (1 + maxVariancePercent)
    const actualMax = Math.max(maxY, price_30_j, price_7_j, price_1_j, price_0_j)
    const actualMin = Math.min(minY, price_30_j, price_7_j, price_1_j, price_0_j)

    const { backgroundColors, backgroundPulseSegments } = useMemo(() => {
        const seg0 = segmentColorFromVariance(
            price_30_j,
            price_7_j,
            maxVariancePercent,
            PRICE_TREND_GRADIENT_HEX,
            REAL_DAYS_J30_TO_J7
        )
        const seg1 = segmentColorFromVariance(
            price_7_j,
            price_1_j,
            maxVariancePercent,
            PRICE_TREND_GRADIENT_HEX,
            REAL_DAYS_J7_TO_J1
        )
        const seg2 = segmentColorFromVariance(
            price_1_j,
            price_0_j,
            maxVariancePercent,
            PRICE_TREND_GRADIENT_HEX,
            REAL_DAYS_J1_TO_NOW
        )
        return {
            backgroundColors: [hexWithAlpha(seg0[0]), hexWithAlpha(seg1[0]), hexWithAlpha(seg2[0])],
            backgroundPulseSegments: [
                isVarianceGradientExtreme(seg0[1]),
                isVarianceGradientExtreme(seg1[1]),
                isVarianceGradientExtreme(seg2[1])
            ]
        }
    }, [price_30_j, price_7_j, price_1_j, price_0_j, maxVariancePercent])

    return (
        <TrendArrowIcon
            values={[price_30_j, price_7_j, price_1_j, price_0_j]}
            gap={[REAL_DAYS_J30_TO_J7, REAL_DAYS_J7_TO_J1, REAL_DAYS_J1_TO_NOW]}
            width={width}
            height={height}
            color={color}
            strokeWidth={strokeWidth}
            minY={actualMin}
            maxY={actualMax}
            backgroundColors={backgroundColors}
            backgroundPulseSegments={backgroundPulseSegments}
        />
    )
}
