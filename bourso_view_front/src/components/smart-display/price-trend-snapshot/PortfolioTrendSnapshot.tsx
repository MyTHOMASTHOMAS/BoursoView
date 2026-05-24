/**
 * @file PortfolioTrendSnapshot.tsx
 * @description Panneau de variations pour une valorisation totale de portefeuille (Dietz Modifié).
 */
import { useMemo } from 'react'
import { TREND_SNAPSHOT_OFF_CURVE_PERIODS, TREND_SNAPSHOT_PERIODS } from './constants'
import { hasPortfolioPeriodData } from './periodData'
import { PortfolioTrendDeltaCard } from './PortfolioTrendDeltaCard'
import { TrendOffCurveSection } from './TrendOffCurveSection'
import { TrendSnapshotLayout } from './TrendSnapshotLayout'
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

function renderPortfolioDeltaCard(
    key: string,
    displayMode: 'onCurve' | 'offCurve',
    props: {
        label: string
        segmentDays: number
        estimatedRef: number
        investRef: number
        estimatedCurrent: number
        investCurrent: number
        variance: number
    },
) {
    const { label, segmentDays, estimatedRef, investRef, estimatedCurrent, investCurrent, variance } =
        props

    return (
        <PortfolioTrendDeltaCard
            key={key}
            label={label}
            displayMode={displayMode}
            estimatedCurrent={estimatedCurrent}
            estimatedRef={estimatedRef}
            investCurrent={investCurrent}
            investRef={investRef}
            variance={variance}
            segmentDays={segmentDays}
        />
    )
}

/**
 * Panneau de snapshot portefeuille : valorisation + cartes courbe + cartes hors courbe.
 */
export function PortfolioTrendSnapshot({
    estimated,
    invest,
    variance = 0.2,
    className = '',
}: PortfolioTrendSnapshotProps) {
    const curvePeriods = useMemo(
        () =>
            TREND_SNAPSHOT_PERIODS.map(({ label, segmentDays, portfolioKey }) => ({
                label,
                segmentDays,
                estimatedRef: estimated[portfolioKey],
                investRef: invest[portfolioKey],
            })),
        [estimated, invest],
    )

    const offCurvePeriods = useMemo(
        () =>
            TREND_SNAPSHOT_OFF_CURVE_PERIODS.map(({ label, segmentDays, portfolioKey }) => ({
                label,
                segmentDays,
                estimatedRef: estimated[portfolioKey],
                investRef: invest[portfolioKey],
            })),
        [estimated, invest],
    )

    const offCurveCards = offCurvePeriods
        .filter(({ estimatedRef, investRef }) => hasPortfolioPeriodData(estimatedRef, investRef))
        .map(({ label, estimatedRef, investRef, segmentDays }) =>
            renderPortfolioDeltaCard(label, 'offCurve', {
                label,
                segmentDays,
                estimatedRef,
                investRef,
                estimatedCurrent: estimated.current,
                investCurrent: invest.current,
                variance,
            }),
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
            offCurveChildren={
                offCurveCards.length > 0 ? (
                    <TrendOffCurveSection>{offCurveCards}</TrendOffCurveSection>
                ) : undefined
            }
        >
            {curvePeriods.map(({ label, estimatedRef, investRef, segmentDays }) =>
                renderPortfolioDeltaCard(label, 'onCurve', {
                    label,
                    segmentDays,
                    estimatedRef,
                    investRef,
                    estimatedCurrent: estimated.current,
                    investCurrent: invest.current,
                    variance,
                }),
            )}
        </TrendSnapshotLayout>
    )
}
