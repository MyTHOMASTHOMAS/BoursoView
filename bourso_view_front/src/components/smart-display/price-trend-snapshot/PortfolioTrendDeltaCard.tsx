/**
 * @file PortfolioTrendDeltaCard.tsx
 * @description Carte de variation portefeuille (Dietz Modifié), symétrique à `TrendDeltaCard`.
 */
import { TrendDeltaCardBase } from './TrendDeltaCardBase'
import { computeModifiedDietz, computeAdjustedPriceReference } from '../../../utils/math'

type PortfolioTrendDeltaCardProps = {
    label: string
    displayMode?: 'onCurve' | 'offCurve'
    estimatedCurrent: number
    estimatedRef: number
    investCurrent: number
    investRef: number
    variance: number
    segmentDays: number
}

export function PortfolioTrendDeltaCard({
    label,
    displayMode = 'onCurve',
    estimatedCurrent,
    estimatedRef,
    investCurrent,
    investRef,
    variance,
    segmentDays,
}: PortfolioTrendDeltaCardProps) {
    const { delta, deltaPercent } = computeModifiedDietz(
        estimatedCurrent,
        estimatedRef,
        investCurrent,
        investRef,
    )
    const adjRef = computeAdjustedPriceReference(
        estimatedCurrent,
        estimatedRef,
        investCurrent,
        investRef,
    )

    return (
        <TrendDeltaCardBase
            label={label}
            displayMode={displayMode}
            delta={delta}
            deltaPercent={deltaPercent}
            priceStart={adjRef}
            priceEnd={estimatedCurrent}
            variance={variance}
            segmentDays={segmentDays}
        />
    )
}
