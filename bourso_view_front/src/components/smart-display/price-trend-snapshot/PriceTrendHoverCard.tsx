/**
 * @file PriceTrendHoverCard.tsx
 * @description Wrapper pour prix d'actif individuel → `TrendHoverCard`.
 *
 * Calcule les valeurs du sparkline directement depuis les prix bruts (pas de correction de flux),
 * puis délègue l'affichage à `TrendHoverCard` avec `PriceTrendSnapshot` comme popup.
 */
import { useAppStore } from '../../../store'
import { PriceTrendSnapshot } from './PriceTrendSnapshot'
import { TrendHoverCard } from './TrendHoverCard'

/**
 * Props du bouton déclencheur + overlay : mêmes niveaux de prix que `PriceTrendSnapshot` / sparkline.
 */
export type PriceTrendHoverCardProps = {
    /** Prix spot affiché à droite du sparkline. */
    price: number
    price_j_1: number
    price_j_7: number
    price_m_1: number
    /**
     * Échelle commune sparkline + cartes delta ; si omis, utilise `useAppStore.defaultVariance`
     * (persistée dans le localStorage — voir slice affichage).
     */
    variance?: number
}

/**
 * Hover card pour un prix d'actif individuel (ETF, action…).
 * Le sparkline utilise les prix bruts → popup `PriceTrendSnapshot`.
 */
export function PriceTrendHoverCard({
    price,
    price_j_1,
    price_j_7,
    price_m_1,
    variance,
}: PriceTrendHoverCardProps) {
    const defaultVariance = useAppStore((s) => s.defaultVariance)
    const effectiveVariance = variance ?? defaultVariance

    return (
        <TrendHoverCard
            sparkline={{ p0: price, p1: price_j_1, p7: price_j_7, p30: price_m_1 }}
            displayValue={price.toFixed(2)}
            variance={effectiveVariance}
            ariaLabel="Afficher le détail de variation du prix"
            snapshot={
                <PriceTrendSnapshot
                    price={price}
                    price_j_1={price_j_1}
                    price_j_7={price_j_7}
                    price_m_1={price_m_1}
                    variance={effectiveVariance}
                />
            }
        />
    )
}
