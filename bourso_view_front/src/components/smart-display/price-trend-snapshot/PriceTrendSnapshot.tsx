import { useMemo } from 'react'
import { TrendDeltaCard } from './TrendDeltaCard'
import { TrendSnapshotLayout } from './TrendSnapshotLayout'
import { TREND_SNAPSHOT_PERIODS } from './constants'
import type { DeltaMeta, PriceTrendSnapshotProps } from './types'

/**
 * Panneau carte : prix actuel + trois colonnes de variation (1 jour, 7 jours, 1 mois).
 */
export function PriceTrendSnapshot({
    price,
    price_j_1,
    price_j_7,
    price_m_1,
    variance = 0.2,
    className = '',
}: PriceTrendSnapshotProps) {
    const priceRefs = [price_j_1, price_j_7, price_m_1] as const
    const deltas: DeltaMeta[] = useMemo(
        () =>
            TREND_SNAPSHOT_PERIODS.map(({ label, segmentDays }, index) => ({
                label,
                reference: priceRefs[index],
                segmentDays,
            })),
        [price_j_1, price_j_7, price_m_1],
    )

    return (
        <TrendSnapshotLayout
            headerLabel="Prix actuel"
            headerValue={price.toFixed(2)}
            variance={variance}
            className={className}
        >
            {deltas.map(({ label, reference, segmentDays }) => (
                <TrendDeltaCard
                    key={label}
                    label={label}
                    price={price}
                    reference={reference}
                    variance={variance}
                    segmentDays={segmentDays}
                />
            ))}
        </TrendSnapshotLayout>
    )
}
