/**
 * @file PortfolioTrendSnapshot.tsx
 * @description Panneau de variations pour une valorisation totale de portefeuille (Dietz Modifié).
 */
import { useMemo } from 'react'
import { PortfolioTrendDeltaCard } from './PortfolioTrendDeltaCard'
import { TrendSnapshotLayout } from './TrendSnapshotLayout'
import { TREND_SNAPSHOT_PERIODS } from './constants'
import { format } from '../../../utils/math'
import type { PortfolioPeriodSeries } from './types'

export type PortfolioTrendSnapshotProps = {
    estimated: PortfolioPeriodSeries
    invest: PortfolioPeriodSeries
    /**
     * Amplitude de variance attendue pour le gradient de couleur des cartes.
     * Doit rester cohérente avec `QuickTrendCurve.maxVariancePercent`.
     */
    variance?: number
    className?: string
}

/**
 * Panneau de snapshot pour un portefeuille : valorisation actuelle + trois cartes de variation
 * (1 jour, 7 jours, 1 mois), toutes corrigées des apports (Dietz Modifié).
 */
export function PortfolioTrendSnapshot({
    estimated,
    invest,
    variance = 0.2,
    className = '',
}: PortfolioTrendSnapshotProps) {
    const periods = useMemo(
        () =>
            TREND_SNAPSHOT_PERIODS.map(({ label, segmentDays, portfolioKey }) => ({
                label,
                segmentDays,
                estimatedRef: estimated[portfolioKey],
                investRef: invest[portfolioKey],
            })),
        [estimated, invest],
    )

    return (
        <TrendSnapshotLayout
            headerLabel="Valorisation estimée"
            headerValue={format(estimated.current)}
            className={className}
            footer={
                <p className="text-[10px] text-text-muted text-center border-t border-white/5 pt-2">
                    Variations marché hors apports (Dietz Modifié)
                </p>
            }
        >
            {periods.map(({ label, estimatedRef, investRef, segmentDays }) => (
                <PortfolioTrendDeltaCard
                    key={label}
                    label={label}
                    estimatedCurrent={estimated.current}
                    estimatedRef={estimatedRef}
                    investCurrent={invest.current}
                    investRef={investRef}
                    variance={variance}
                    segmentDays={segmentDays}
                />
            ))}
        </TrendSnapshotLayout>
    )
}
