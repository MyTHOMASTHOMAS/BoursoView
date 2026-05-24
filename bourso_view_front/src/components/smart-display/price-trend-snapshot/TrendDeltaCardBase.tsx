/**
 * @file TrendDeltaCardBase.tsx
 * @description Composant d'affichage partagé pour les cartes de variation de prix/valorisation.
 *
 * Ce composant est la **couche d'affichage pure** : il ne calcule aucun delta.
 * Les deux variants du système l'utilisent :
 *  - `TrendDeltaCard`          → delta calculé par `price - reference`
 *  - `PortfolioTrendSnapshot`  → delta calculé par la Méthode de Dietz Modifiée
 *
 * La couleur et l'orientation de la flèche sont déterminées par `trendVisualFromVariance`
 * appliqué à `priceStart` / `priceEnd`, assurant un rendu visuellement cohérent
 * quel que soit le mode de calcul du delta.
 */
import { DirectionArrowIcon } from '../../icons/DirectionArrowIcon'
import { formatSignedNumber, formatSignedPercent } from '../../../utils/math'
import { trendVisualFromVariance } from './varianceTrendVisual'

export type TrendDeltaCardBaseProps = {
    /** Libellé affiché en haut de la carte (ex. « 1 jour »). */
    label: string
    /** Delta absolu pré-calculé (en unité monétaire ou autre). */
    delta: number
    /** Variation relative pré-calculée en %. */
    deltaPercent: number
    /**
     * Prix de début de segment pour `trendVisualFromVariance`.
     * - Mode prix : référence historique brute.
     * - Mode Dietz : référence ajustée (`computeAdjustedPriceReference`).
     */
    priceStart: number
    /** Prix de fin de segment = prix courant. */
    priceEnd: number
    /** Amplitude de variance attendue pour le gradient de couleur. */
    variance: number
    /** Durée du segment en jours pour la pondération du gradient. */
    segmentDays: number
}

/**
 * Carte compacte affichant un label, un badge % coloré (gradient variance) et un montant signé.
 * Composant de présentation pur — ne calcule aucune valeur.
 */
export function TrendDeltaCardBase({
    label,
    delta,
    deltaPercent,
    priceStart,
    priceEnd,
    variance,
    segmentDays,
}: TrendDeltaCardBaseProps) {
    const { color, arrowRotationDeg, isExtreme } = trendVisualFromVariance(
        priceStart,
        priceEnd,
        variance,
        segmentDays,
    )
    const blinkClass = isExtreme ? 'animate-variance-extreme' : ''

    return (
        <div className="flex flex-col items-center text-center flex-1 basis-[90px] min-w-[88px] rounded-xl bg-slate-900 border border-white/10 p-2 sm:p-3 space-y-1.5 sm:space-y-2">
            <div className="text-[11px] sm:text-xs text-text-muted w-full">{label}</div>

            {/* Badge % */}
            <div
                className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium border bg-slate-950/50 ${blinkClass}`}
                style={{ borderColor: color, color }}
            >
                <DirectionArrowIcon rotation={arrowRotationDeg} color={color} size={12} className="shrink-0" />
                <span>{formatSignedPercent(deltaPercent)}</span>
            </div>

            {/* Montant absolu */}
            <div className={`text-[11px] sm:text-sm font-medium ${blinkClass}`} style={{ color }}>
                {formatSignedNumber(delta)}
            </div>
        </div>
    )
}
