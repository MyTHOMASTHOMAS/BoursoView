import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts'
import { DURATION_OPTIONS, type BasicChartPoint, type DurationOption } from './useBasicCharts'

type BasicChartsViewProps = {
    indice: string
    startDate: string
    endDate: string
    chartData: BasicChartPoint[]
    duration: DurationOption
    selectedDuration: DurationOption
    loading: boolean
    error: string | null
    hasData: boolean
    isCustomRangeReady: boolean
    customStartDate: string
    customEndDate: string
    onCustomStartDateChange: (value: string) => void
    onCustomEndDateChange: (value: string) => void
    onApplyCustomRange: () => void
    onDurationChange: (duration: DurationOption) => void
}

export function BasicChartsView({
    indice,
    startDate,
    endDate,
    chartData,
    duration,
    selectedDuration,
    loading,
    error,
    hasData,
    isCustomRangeReady,
    customStartDate,
    customEndDate,
    onCustomStartDateChange,
    onCustomEndDateChange,
    onApplyCustomRange,
    onDurationChange
}: BasicChartsViewProps) {
    if (loading) {
        return (
            <div className="rounded-xl border border-subtle bg-slate-900 p-4">
                <p className="text-muted">Chargement de l'historique...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-400/30 bg-slate-900 p-4">
                <p className="text-error">Erreur: {error}</p>
            </div>
        )
    }

    if (!hasData) {
        return (
            <div className="rounded-xl border border-subtle bg-slate-900 p-4">
                <p className="text-muted">Aucune donnée disponible pour cette plage.</p>
            </div>
        )
    }

    return (
        <div className="space-y-3 rounded-xl border border-subtle bg-slate-900 p-4">
            <div>
                <p className="text-primary font-semibold tracking-wide">{indice}</p>
                <p className="text-muted text-small">Cours de clôture journalier ({startDate} → {endDate})</p>
            </div>

            <div className="space-y-2">
                <p className="text-muted text-small">Durée</p>
                <select
                    value={selectedDuration}
                    onChange={(event) => onDurationChange(event.target.value as DurationOption)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-primary"
                >
                    {DURATION_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {selectedDuration === 'CUSTOM' && (
                    <div className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <label className="space-y-1">
                                <span className="text-muted text-small">Date de début</span>
                                <input
                                    type="date"
                                    value={customStartDate}
                                    onChange={(event) => onCustomStartDateChange(event.target.value)}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-primary"
                                />
                            </label>
                            <label className="space-y-1">
                                <span className="text-muted text-small">Date de fin</span>
                                <input
                                    type="date"
                                    value={customEndDate}
                                    onChange={(event) => onCustomEndDateChange(event.target.value)}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-primary"
                                />
                            </label>
                        </div>
                        <button
                            type="button"
                            onClick={onApplyCustomRange}
                            disabled={!customStartDate || !customEndDate}
                            className="rounded-lg border border-sky-400 bg-sky-500/15 px-3 py-2 text-sky-200 text-small transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            Valider
                        </button>
                        {duration !== 'CUSTOM' && (
                            <p className="text-muted text-small">
                                La plage personnalisée sera appliquée après validation.
                            </p>
                        )}
                    </div>
                )}
                {duration === 'CUSTOM' && !isCustomRangeReady && (
                    <div className="rounded-lg border border-subtle bg-slate-950 px-3 py-2">
                        <p className="text-muted text-small">Sélectionne une date de début et une date de fin, puis clique sur Valider.</p>
                    </div>
                )}
            </div>

            <div className="h-80 w-full rounded-lg border border-slate-700/70 bg-slate-950 p-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: '#cbd5e1', fontSize: 11 }}
                            axisLine={{ stroke: 'rgba(148,163,184,0.35)' }}
                            tickLine={{ stroke: 'rgba(148,163,184,0.35)' }}
                            minTickGap={24}
                        />
                        <YAxis
                            tick={{ fill: '#cbd5e1', fontSize: 11 }}
                            axisLine={{ stroke: 'rgba(148,163,184,0.35)' }}
                            tickLine={{ stroke: 'rgba(148,163,184,0.35)' }}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0b1220',
                                border: '1px solid rgba(148, 163, 184, 0.35)',
                                borderRadius: 8
                            }}
                            labelStyle={{ color: '#e2e8f0' }}
                            itemStyle={{ color: '#7dd3fc' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="close"
                            stroke="#38bdf8"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                            connectNulls
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
