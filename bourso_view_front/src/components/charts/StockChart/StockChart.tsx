/**
 * @file StockChart.tsx
 * @description Composant "lecteur de cache" passif pour un ticker donné.
 *
 * Il n'émet JAMAIS de requête réseau (enabled: false).
 * Il écoute simplement le cache React Query.
 * Quand FinanceHistoryService appelle setData.get() pour ce ticker,
 * ce composant se met à jour automatiquement.
 */
import { api } from '../../../api/api'
import type { ContextType } from 'Shared/RouteType'

export type StockChartProps = {
    ticker: string
    startDate: string
    endDate: string
    period?: ContextType.HistoryPeriod
}

export function StockChart({ ticker, startDate, endDate, period = 'DAILY' }: StockChartProps) {
    const { data } = api.financeHistory.useQuery.get(
        { queryParams: { ticker, startDate, endDate, period } },
        {
            enabled: false,   // Ne fait jamais d'appel réseau tout seul
            staleTime: 1000 * 60 * 60 * 24, // Considère la donnée fraîche 24h
        }
    )

    if (!data) {
        return (
            <div className="glass-card radius-card p-6 flex items-center justify-center gap-3 min-h-[180px]">
                <div className="w-5 h-5 border-2 border-subtle border-t-brand rounded-full animate-spin opacity-50" />
                <span className="text-muted text-small">
                    En attente des données pour <span className="text-primary font-mono">{ticker}</span>…
                </span>
            </div>
        )
    }

    const lastClose = data.close.at(-1)
    const lastDate  = data.date.at(-1)
    const firstClose = data.close[0]
    const pct = firstClose ? (((lastClose ?? 0) - firstClose) / firstClose) * 100 : null

    return (
        <div className="glass-card radius-card p-5 space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-primary font-semibold text-small">{ticker}</span>
                {pct !== null && (
                    <span className={pct >= 0 ? 'text-green-400 text-small font-medium' : 'text-red-400 text-small font-medium'}>
                        {pct >= 0 ? '+' : ''}{pct.toFixed(2)} %
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <p className="text-heading-lg text-primary">
                    {lastClose !== undefined ? lastClose.toFixed(2) : '—'}
                </p>
                <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Dernier cours · {lastDate ?? '—'} · {data.date.length} points
                </p>
            </div>

            {/* Sparkline SVG simple */}
            <SparkLine values={data.close} />
        </div>
    )
}

// ---------------------------------------------------------------------------
// Sparkline SVG minimaliste
// ---------------------------------------------------------------------------

function SparkLine({ values }: { values: number[] }) {
    if (values.length < 2) return null

    const min  = Math.min(...values)
    const max  = Math.max(...values)
    const range = max - min || 1
    const w = 300
    const h = 60
    const step = w / (values.length - 1)

    const points = values
        .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
        .join(' ')

    const isPositive = values.at(-1)! >= values[0]

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16 mt-1" preserveAspectRatio="none">
            <polyline
                fill="none"
                stroke={isPositive ? '#4ade80' : '#f87171'}
                strokeWidth="1.5"
                points={points}
            />
        </svg>
    )
}

export default StockChart
