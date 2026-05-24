/**
 * @file PerformanceCard.tsx
 * @description Carte de performance : investi vs estimé, plus-value, variations par période.
 *
 * Les variations par période (J-1, J-7, J-30) utilisent `computeModifiedDietz`
 * pour neutraliser l'effet des apports de capital sur les taux de rendement.
 */
import {
    computePnL,
    computeModifiedDietz,
    format,
    formatSignedEur,
    formatSignedPercent,
} from '../../../../utils/math'
import type { ResponseType as RT } from 'Shared/RouteType'

type PerformanceCardProps = {
    total: RT.GetResumeAction['transaction']['total']
}

type PeriodRowProps = {
    label: string
    deltaPercent: number
    delta: number
}

/** Ligne de performance par période (J-1, J-7, J-30) avec indicateur coloré. */
function PeriodRow({ label, deltaPercent, delta }: PeriodRowProps) {
    const isUp = delta >= 0
    const isNaN = Number.isNaN(deltaPercent)
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-muted w-8">{label}</span>
            <div className="flex items-center gap-1.5">
                <span className={`text-[11px] font-medium tabular-nums ${isNaN ? 'text-muted' : isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isNaN ? '—' : formatSignedEur(delta, 2)}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border tabular-nums ${
                    isNaN
                        ? 'text-muted border-white/10 bg-transparent'
                        : isUp
                            ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
                            : 'bg-red-400/10 text-red-400 border-red-400/20'
                }`}>
                    {formatSignedPercent(deltaPercent, 2)}
                </span>
            </div>
        </div>
    )
}

/**
 * Carte de performance : compare l'investi à l'estimé et affiche la plus-value globale
 * ainsi que les rendements par période corrigés des flux (Méthode de Dietz Modifiée).
 */
export function PerformanceCard({ total }: PerformanceCardProps) {
    const { invest, estimated } = total
    const pnl = computePnL(estimated.current, invest.current)
    const isPositive = pnl.absolute >= 0

    // Rendements par période — neutralisés des apports de capital (Dietz Modifié)
    const perfJ1  = computeModifiedDietz(estimated.current, estimated.j1,  invest.current, invest.j1)
    const perfJ7  = computeModifiedDietz(estimated.current, estimated.j7,  invest.current, invest.j7)
    const perfJ30 = computeModifiedDietz(estimated.current, estimated.j30, invest.current, invest.j30)
    const perfM6  = computeModifiedDietz(estimated.current, estimated.m6,  invest.current, invest.m6)
    const perfY1  = computeModifiedDietz(estimated.current, estimated.y1,  invest.current, invest.y1)

    return (
        <div className="glass-card radius-card p-4 flex flex-col gap-3 shrink-0 hover:border-primary/30 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <p className="text-muted text-small font-medium uppercase tracking-wide">Performance</p>
            </div>

            {/* Investi / Estimé */}
            <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-small text-muted">Investi total</span>
                    <span className="text-small font-semibold text-body tabular-nums">
                        {format(invest.current)}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <span className="text-small text-muted">Estimé actuel</span>
                    <span className="text-small font-semibold text-primary tabular-nums">
                        {format(estimated.current)}
                    </span>
                </div>
            </div>

            {/* Plus-value globale */}
            <div className={`
                flex items-center justify-between gap-3 px-3 py-2 rounded-lg border
                ${isPositive
                    ? 'bg-emerald-400/8 border-emerald-400/20'
                    : 'bg-red-400/8 border-red-400/20'
                }
            `}>
                <span className="text-small text-muted">Plus-value</span>
                <div className="flex items-center gap-2 tabular-nums">
                    <span className={`text-small font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formatSignedEur(pnl.absolute)}
                    </span>
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full border ${
                        isPositive
                            ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
                            : 'bg-red-400/10 text-red-400 border-red-400/20'
                    }`}>
                        {formatSignedPercent(pnl.percent)}
                    </span>
                </div>
            </div>

            {/* Rendements par période (Dietz Modifié) */}
            <div className="border-t border-white/5 pt-2 space-y-1.5">
                <p className="text-[10px] text-muted uppercase tracking-wide mb-2">
                    Variation marché (hors apports)
                </p>
                <PeriodRow label="J-1"  deltaPercent={perfJ1.deltaPercent}  delta={perfJ1.delta} />
                <PeriodRow label="J-7"  deltaPercent={perfJ7.deltaPercent}  delta={perfJ7.delta} />
                <PeriodRow label="J-30" deltaPercent={perfJ30.deltaPercent} delta={perfJ30.delta} />
                <PeriodRow label="M-6"  deltaPercent={perfM6.deltaPercent}  delta={perfM6.delta} />
                <PeriodRow label="Y-1"  deltaPercent={perfY1.deltaPercent}  delta={perfY1.delta} />
            </div>
        </div>
    )
}
