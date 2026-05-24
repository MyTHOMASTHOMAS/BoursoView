/**
 * @file PositionCard.tsx
 * @description Carte des positions : titres détenus, PRU, valeur brute, frais.
 */
import { format } from '../../../../utils/math'
import type { DashboardSummaryData } from '../../data/dashboardMockData'

type PositionCardProps = {
    transaction: Pick<
        DashboardSummaryData['transaction'],
        'count' | 'nb' | 'price' | 'pru' | 'comission' | 'fee'
    >
}

type StatCellProps = {
    label: string
    value: string
    sub?: string
}

/** Cellule de statistique minimaliste dans la grille des positions. */
function StatCell({ label, value, sub }: StatCellProps) {
    return (
        <div className="space-y-0.5">
            <p className="text-muted text-[11px] font-medium uppercase tracking-wide">{label}</p>
            <p className="text-small font-semibold text-body tabular-nums">{value}</p>
            {sub && <p className="text-[11px] text-muted">{sub}</p>}
        </div>
    )
}

/**
 * Carte des positions : nombre de titres, PRU, valeur brute et frais totaux.
 */
export function PositionCard({ transaction }: PositionCardProps) {
    const totalFees = transaction.comission + transaction.fee

    return (
        <div className="glass-card radius-card p-4 space-y-3 hover:border-primary/30 transition-all duration-300">
            {/* Header */}
            <p className="text-muted text-small font-medium uppercase tracking-wide">Positions</p>

            {/* Grille 2×3 */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1">
                <StatCell
                    label="Titres détenus"
                    value={`${transaction.nb}`}
                    sub={`${transaction.count} transaction${transaction.count > 1 ? 's' : ''}`}
                />
                <StatCell
                    label="PRU"
                    value={format(transaction.pru)}
                />
                <StatCell
                    label="Valeur brute"
                    value={format(transaction.price)}
                />
                <StatCell
                    label="Frais totaux"
                    value={format(totalFees)}
                    sub={`Commissions ${format(transaction.comission)} · Fees ${format(transaction.fee)}`}
                />
            </div>
        </div>
    )
}
