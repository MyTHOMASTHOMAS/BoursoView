/**
 * @file DashboardPortfolioCard.tsx
 * @description Carte de valorisation du portefeuille avec `PortfolioTrendHoverCard`.
 *
 * Le widget utilise la Méthode de Dietz Modifiée pour afficher des variations
 * de marché cohérentes avec `PerformanceCard` (hors apports de capital).
 */
import { PortfolioTrendHoverCard } from '../../../components/smart-display'
import { format } from '../../../utils/math'
import type { DashboardSummaryData } from '../data/dashboardMockData'

type DashboardPortfolioCardProps = {
    /** Valeur liquidative affichée en grand (ex. "2 912,91"). */
    totalValue: string
    /** Badge de performance depuis l'origine (ex. "+11,6 %"). */
    totalDelta: string
    /** Date de référence affichée en sous-titre. */
    asOf?: string
    /** Séries estimated + invest pour le PortfolioTrendHoverCard. */
    total: DashboardSummaryData['transaction']['total']
}

/**
 * Carte de valorisation du portefeuille.
 * `PortfolioTrendHoverCard` (sparkline + popup Dietz) est ancré dans le footer.
 */
export function DashboardPortfolioCard({
    totalValue,
    totalDelta,
    asOf = '24/05/2026',
    total,
}: DashboardPortfolioCardProps) {
    return (
        <div className="glass-card radius-card p-5 space-y-4 hover:border-primary transition-all duration-300">
            <p className="text-muted text-small font-medium">Valeur totale du portefeuille</p>

            <div className="space-y-0.5">
                <p className="text-heading-lg text-primary font-bold tabular-nums">{totalValue}</p>
                <p className="text-small text-muted tabular-nums">
                Total engagé : {format(total.invest.current)}
                </p>
            </div>

            <div className="border-t border-white/5 pt-3 flex items-center justify-between gap-3 flex-wrap">
                <div className="space-y-0.5">
                    <p className="text-muted text-small">Évaluation au {asOf}</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-emerald-400/10 text-emerald-400 border-emerald-400/20">
                        {totalDelta} depuis l'origine
                    </span>
                </div>

                <PortfolioTrendHoverCard
                    estimated={total.estimated}
                    invest={total.invest}
                />
            </div>
        </div>
    )
}
