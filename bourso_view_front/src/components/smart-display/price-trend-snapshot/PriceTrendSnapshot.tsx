import { useMemo } from 'react'
import { TrendDeltaCard } from './TrendDeltaCard'
import type { DeltaMeta, PriceTrendSnapshotProps } from './types'

/**
 * Panneau carte : prix actuel + trois colonnes de variation (1 jour, 7 jours, 1 mois).
 *
 * Le tableau `deltas` est mémoïsé pour éviter une nouvelle allocation à chaque rendu du parent
 * lorsque seuls `price` ou `variance` changent sans toucher aux références historiques.
 */
export function PriceTrendSnapshot({
    price,
    price_j_1,
    price_j_7,
    price_m_1,
    variance = 0.2,
    className = ''
}: PriceTrendSnapshotProps) {
    const deltas: DeltaMeta[] = useMemo(
        () => [
            { label: '1 jour', reference: price_j_1, segmentDays: 1 },
            { label: '7 jours', reference: price_j_7, segmentDays: 7 },
            { label: '1 mois', reference: price_m_1, segmentDays: 30 }
        ],
        [price_j_1, price_j_7, price_m_1]
    )

    return (
        <div
            className={`w-full rounded-2xl border border-primary/25 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-3 sm:p-4 space-y-3 shadow-card ${className}`}
            data-variance={variance}
        >
            <div className="flex items-baseline justify-between gap-3">
                <span className="text-text-muted text-xs sm:text-sm">Prix actuel</span>
                <span className="text-text text-base sm:text-lg font-semibold">{price.toFixed(2)}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
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
            </div>
        </div>
    )
}
