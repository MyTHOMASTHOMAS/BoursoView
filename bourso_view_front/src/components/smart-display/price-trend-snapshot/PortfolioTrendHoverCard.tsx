/**
 * @file PortfolioTrendHoverCard.tsx
 * @description Wrapper pour valorisation de portefeuille → `TrendHoverCard`.
 *
 * Calcule les références ajustées (Méthode de Dietz Modifiée) pour le sparkline,
 * puis délègue l'affichage à `TrendHoverCard` avec `PortfolioTrendSnapshot` comme popup.
 * Le résultat visuel est identique à `PriceTrendHoverCard` (même composant de sortie).
 */
import { useAppStore } from '../../../store'
import { PortfolioTrendSnapshot } from './PortfolioTrendSnapshot'
import { TrendHoverCard } from './TrendHoverCard'
import { computeAdjustedPriceReference, format } from '../../../utils/math'
import type { PortfolioPeriodSeries } from './types'

export type PortfolioTrendHoverCardProps = {
    /** Séries de valorisation estimée par période. */
    estimated: PortfolioPeriodSeries
    /** Séries de montant investi par période. */
    invest: PortfolioPeriodSeries
    /**
     * Amplitude de variance pour le gradient couleur (sparkline + cartes).
     * Si omis, utilise `useAppStore.defaultVariance`.
     */
    variance?: number
}

/**
 * Hover card pour une valorisation totale de portefeuille.
 * Le sparkline utilise des références ajustées Dietz → popup `PortfolioTrendSnapshot`.
 * Même composant de sortie (`TrendHoverCard`) que `PriceTrendHoverCard`.
 */
export function PortfolioTrendHoverCard({ estimated, invest, variance }: PortfolioTrendHoverCardProps) {
    const defaultVariance = useAppStore((s) => s.defaultVariance)
    const effectiveVariance = variance ?? defaultVariance

    // Références ajustées pour un sparkline de marché pur (neutralise les apports)
    const adjJ1  = computeAdjustedPriceReference(estimated.current, estimated.j1,  invest.current, invest.j1)
    const adjJ7  = computeAdjustedPriceReference(estimated.current, estimated.j7,  invest.current, invest.j7)
    const adjJ30 = computeAdjustedPriceReference(estimated.current, estimated.j30, invest.current, invest.j30)

    const displayValue = format(estimated.current)

    return (
        <TrendHoverCard
            sparkline={{ p0: estimated.current, p1: adjJ1, p7: adjJ7, p30: adjJ30 }}
            displayValue={displayValue}
            variance={effectiveVariance}
            ariaLabel="Afficher les variations de marché du portefeuille"
            snapshot={
                <PortfolioTrendSnapshot
                    estimated={estimated}
                    invest={invest}
                    variance={effectiveVariance}
                />
            }
        />
    )
}
