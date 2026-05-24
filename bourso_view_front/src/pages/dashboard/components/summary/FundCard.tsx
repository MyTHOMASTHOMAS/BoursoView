/**
 * @file FundCard.tsx
 * @description Carte des fonds du compte-titre : total versé, disponible, engagé.
 */
import { format } from '../../../../utils/math'
import type { DashboardSummaryData } from '../../data/dashboardMockData'

type FundCardProps = {
    data: DashboardSummaryData
}

type FundRowProps = {
    label: string
    value: string
    highlight?: boolean
    muted?: boolean
}

function FundRow({ label, value, highlight, muted }: FundRowProps) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className={`text-small ${muted ? 'text-muted' : 'text-body'}`}>{label}</span>
            <span className={`text-small font-semibold tabular-nums ${highlight ? 'text-primary' : 'text-body'}`}>
                {value}
            </span>
        </div>
    )
}

/**
 * Carte récapitulative des fonds : total versé, liquidités disponibles et montant engagé.
 */
export function FundCard({ data }: FundCardProps) {

    return (
        <div className="glass-card radius-card p-4 space-y-3 hover:border-primary/30 transition-all duration-300">
            {/* Header */}
            <p className="text-muted text-small font-medium uppercase tracking-wide">Fonds</p>

            {/* Rows */}
            <div className="space-y-2.5 pt-1">
                <FundRow label="Total versé" value={format(data.fund.total)} highlight />
                <FundRow label="Engagé"       value={format(data.transaction.total.invest.current)} />
                <div className="border-t border-white/5" />
                <FundRow label="Disponible"       value={format(data.fund.total - data.transaction.total.invest.current)} />
                <FundRow label="Dividende perçu"       value={format(data.dividendes.amount_net)} />
                <div className="border-t border-white/5" />
                <FundRow label="Total disponible" value={format(data.fund.available)} muted />
            </div>
        </div>
    )
}
