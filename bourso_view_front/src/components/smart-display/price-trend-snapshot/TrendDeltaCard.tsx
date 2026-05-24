/**
 * @file TrendDeltaCard.tsx
 * @description Carte de variation pour un prix d'actif individuel (ETF, action…).
 *
 * Calcule `delta = price − reference` et délègue l'affichage à `TrendDeltaCardBase`.
 * Pour un portefeuille total (avec apports), utiliser `PortfolioTrendDeltaCard`
 * ou `PortfolioTrendSnapshot`.
 */
import { TrendDeltaCardBase } from './TrendDeltaCardBase'

/**
 * Props d'une carte compacte : une ligne du snapshot (1j, 7j, 1 mois).
 */
type TrendDeltaCardProps = {
    /** Libellé affiché en haut de la carte. */
    label: string
    /** Prix actuel (fin du segment). */
    price: number
    /** Prix de référence au début du segment. */
    reference: number
    /** Paramètre `variance` partagé avec le sparkline pour une échelle comparable. */
    variance: number
    /** Nombre de jours du segment pour `getVarianceGradientIndex`. */
    segmentDays: number
}

/**
 * Carte de variation pour un prix unitaire d'actif.
 * Délègue l'affichage à `TrendDeltaCardBase` après calcul du delta brut.
 */
export function TrendDeltaCard({ label, price, reference, variance, segmentDays }: TrendDeltaCardProps) {
    const delta = price - reference
    const deltaPercent = reference !== 0 ? (delta / reference) * 100 : Number.NaN

    return (
        <TrendDeltaCardBase
            label={label}
            delta={delta}
            deltaPercent={deltaPercent}
            priceStart={reference}
            priceEnd={price}
            variance={variance}
            segmentDays={segmentDays}
        />
    )
}
