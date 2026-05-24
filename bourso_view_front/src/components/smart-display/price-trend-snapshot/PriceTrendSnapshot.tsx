import { useMemo } from 'react'
import { TREND_SNAPSHOT_OFF_CURVE_PERIODS, TREND_SNAPSHOT_PERIODS } from './constants'
import { hasPricePeriodData } from './periodData'
import { TrendDeltaCard } from './TrendDeltaCard'
import { TrendOffCurveSection } from './TrendOffCurveSection'
import { TrendSnapshotLayout } from './TrendSnapshotLayout'
import type { DeltaMeta, PriceTrendSnapshotProps } from './types'

const OFF_CURVE_PRICE_REFS = [
    (p: PriceTrendSnapshotProps) => p.price_m_6,
    (p: PriceTrendSnapshotProps) => p.price_y_1,
] as const

/**
 * Panneau carte : prix actuel + variations courbe (1j, 7j, 1 mois) + hors courbe (6 mois, 1 an).
 */
export function PriceTrendSnapshot({
    price,
    price_j_1,
    price_j_7,
    price_m_1,
    price_m_6 = 0,
    price_y_1 = 0,
    variance = 0.2,
    className = '',
}: PriceTrendSnapshotProps) {
    const curveDeltas: DeltaMeta[] = useMemo(
        () =>
            TREND_SNAPSHOT_PERIODS.map(({ label, segmentDays }, index) => {
                const refs = [price_j_1, price_j_7, price_m_1] as const
                return {
                    label,
                    reference: refs[index],
                    segmentDays,
                }
            }),
        [price_j_1, price_j_7, price_m_1],
    )

    const offCurveDeltas = useMemo(
        () =>
            TREND_SNAPSHOT_OFF_CURVE_PERIODS.map(({ label, segmentDays }, index) => ({
                label,
                reference: OFF_CURVE_PRICE_REFS[index]({
                    price,
                    price_j_1,
                    price_j_7,
                    price_m_1,
                    price_m_6,
                    price_y_1,
                }) ?? 0,
                segmentDays,
            })),
        [price, price_j_1, price_j_7, price_m_1, price_m_6, price_y_1],
    )

    const offCurveCards = offCurveDeltas
        .filter(({ reference }) => hasPricePeriodData(reference))
        .map(({ label, reference, segmentDays }) => (
            <TrendDeltaCard
                key={label}
                label={label}
                displayMode="offCurve"
                price={price}
                reference={reference}
                variance={variance}
                segmentDays={segmentDays}
            />
        ))

    return (
        <TrendSnapshotLayout
            headerLabel="Prix actuel"
            headerValue={price.toFixed(2)}
            variance={variance}
            className={className}
            offCurveChildren={
                offCurveCards.length > 0 ? (
                    <TrendOffCurveSection>{offCurveCards}</TrendOffCurveSection>
                ) : undefined
            }
        >
            {curveDeltas.map(({ label, reference, segmentDays }) => (
                <TrendDeltaCard
                    key={label}
                    label={label}
                    displayMode="onCurve"
                    price={price}
                    reference={reference}
                    variance={variance}
                    segmentDays={segmentDays}
                />
            ))}
        </TrendSnapshotLayout>
    )
}
