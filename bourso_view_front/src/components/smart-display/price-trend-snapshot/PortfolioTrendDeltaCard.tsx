/**
 * @file PortfolioTrendDeltaCard.tsx
 * @description Carte de variation portefeuille (Dietz Modifié), symétrique à `TrendDeltaCard`.
 */
import { TrendDeltaCardBase } from './TrendDeltaCardBase'
import { computeModifiedDietz, computeAdjustedPriceReference } from '../../../utils/math'

type PortfolioTrendDeltaCardProps = {
    label: string
    estimatedCurrent: number
    estimatedRef: number
    investCurrent: number
    investRef: number
    variance: number
    segmentDays: number
}

export function PortfolioTrendDeltaCard({
    label,
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
            delta={delta}
            deltaPercent={deltaPercent}
            priceStart={adjRef}
            priceEnd={estimatedCurrent}
            variance={variance}
            segmentDays={segmentDays}
        />
    )
}
