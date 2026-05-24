/**
 * @file DividendesCard.tsx
 * @description Carte des dividendes : versements reçus, montant brut, taxe, net.
 */
import { format } from '../../../../utils/math'
import type { DashboardSummaryData } from '../../data/dashboardMockData'

type DividendesCardProps = {
    dividendes: DashboardSummaryData['dividendes']
}

type DivRowProps = {
    label: string
    value: string
    accent?: boolean
    deduct?: boolean
}

function DivRow({ label, value, accent, deduct }: DivRowProps) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-small text-muted">{label}</span>
            <span className={`text-small font-semibold tabular-nums ${
                accent ? 'text-emerald-400' : deduct ? 'text-red-400' : 'text-body'
            }`}>
                {value}
            </span>
        </div>
    )
}

/**
 * Carte dividendes : nombre de versements, brut, taxe retenue et net perçu.
 */
export function DividendesCard({ dividendes }: DividendesCardProps) {
    return (
        <div className="glass-card radius-card p-4 space-y-3 hover:border-primary/30 transition-all duration-300">
            {/* Header avec badge count */}
            <div className="flex items-center justify-between gap-3">
                <p className="text-muted text-small font-medium uppercase tracking-wide">Dividendes</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-indigo-400/10 text-indigo-300 border-indigo-400/25">
                    {dividendes.count} versement{dividendes.count > 1 ? 's' : ''}
                </span>
            </div>

            {/* Rows */}
            <div className="space-y-2.5 pt-1">
                <DivRow label="Montant brut"  value={format(dividendes.amount_brut)} />
                <DivRow label="Taxe retenue"  value={`−${format(dividendes.taxe)}`}  deduct />
                {dividendes.comission > 0 && (
                    <DivRow label="Commissions" value={`−${format(dividendes.comission)}`} deduct />
                )}
                <div className="border-t border-white/5" />
                <DivRow label="Net perçu"     value={format(dividendes.amount_net)} accent />
            </div>
        </div>
    )
}
