import { useEffect, useRef } from 'react'
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts'
import { Loader } from '../../loading'
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
    const presetDurations = DURATION_OPTIONS.filter((option) => option.value !== 'CUSTOM')
    const isCustomSelected = selectedDuration === 'CUSTOM'
    const durationSectionRef = useRef<HTMLDivElement | null>(null)
    const durationRailRef = useRef<HTMLDivElement | null>(null)
    const chartSectionRef = useRef<HTMLDivElement | null>(null)

    const scrollToChart = () => {
        chartSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const handleDurationChange = (nextDuration: DurationOption) => {
        onDurationChange(nextDuration)
        window.requestAnimationFrame(() => {
            scrollToChart()
        })
    }

    const handleApplyCustomRange = () => {
        onApplyCustomRange()
        window.requestAnimationFrame(() => {
            scrollToChart()
        })
    }

    useEffect(() => {
        const timer = window.setTimeout(() => {
            durationSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 120)

        return () => window.clearTimeout(timer)
    }, [])

    useEffect(() => {
        const activeDurationButton = durationRailRef.current?.querySelector<HTMLButtonElement>('[data-active="true"]')
        if (!activeDurationButton) return

        activeDurationButton.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
        })
    }, [selectedDuration])

    return (
        <div className="space-y-3 rounded-xl border border-subtle bg-slate-900 p-4">
            <div>
                <p className="text-primary font-semibold tracking-wide">{indice}</p>
                <p className="text-muted text-small">Cours de clôture journalier ({startDate} → {endDate})</p>
            </div>

            <div ref={durationSectionRef} className="space-y-2">
                <p className="text-muted text-small">Durée</p>
                <div className="rounded-xl border border-slate-700/70 bg-slate-950/80 p-2">
                    <div ref={durationRailRef} className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1">
                        {presetDurations.map((option) => {
                            const isActive = selectedDuration === option.value
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleDurationChange(option.value)}
                                    data-active={isActive}
                                    className={`
                                        min-w-[82px] shrink-0 snap-start rounded-full px-3 py-2 text-small font-semibold transition-all cursor-pointer
                                        border text-center
                                        ${isActive
                                            ? 'border-sky-300 bg-sky-500/25 text-sky-100 shadow-[0_6px_18px_rgba(14,165,233,0.25)]'
                                            : 'border-slate-700 bg-slate-900/90 text-slate-300 hover:border-slate-500 hover:text-slate-100'
                                        }
                                    `}
                                    aria-pressed={isActive}
                                >
                                    {option.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => handleDurationChange('CUSTOM')}
                    className={`
                        w-full rounded-lg border px-3 py-2 text-small font-medium transition-colors cursor-pointer
                        ${isCustomSelected
                            ? 'border-emerald-300 bg-emerald-500/20 text-emerald-100'
                            : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500 hover:text-slate-100'
                        }
                    `}
                >
                    {isCustomSelected ? 'Plage personnalisée active' : 'Utiliser une plage personnalisée'}
                </button>

                {isCustomSelected && (
                    <div className="space-y-3 rounded-xl border border-slate-700/70 bg-slate-950/70 p-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <label className="space-y-1">
                                <span className="text-muted text-small">Date de début</span>
                                <input
                                    type="date"
                                    value={customStartDate}
                                    onChange={(event) => onCustomStartDateChange(event.target.value)}
                                    className="date-input-purple w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-primary"
                                />
                            </label>
                            <label className="space-y-1">
                                <span className="text-muted text-small">Date de fin</span>
                                <input
                                    type="date"
                                    value={customEndDate}
                                    onChange={(event) => onCustomEndDateChange(event.target.value)}
                                    className="date-input-purple w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-primary"
                                />
                            </label>
                        </div>
                        <button
                            type="button"
                            onClick={handleApplyCustomRange}
                            disabled={!customStartDate || !customEndDate}
                            className="w-full rounded-lg border border-sky-400 bg-sky-500/20 px-3 py-2.5 text-sky-100 text-small font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer md:w-auto"
                        >
                            Valider
                        </button>
                    </div>
                )}
                {duration === 'CUSTOM' && !isCustomRangeReady && (
                    <div className="rounded-lg border border-subtle bg-slate-950 px-3 py-2">
                        <p className="text-muted text-small">Sélectionne une date de début et une date de fin, puis clique sur Valider.</p>
                    </div>
                )}
            </div>

            <div ref={chartSectionRef} className="h-80 w-full rounded-lg border border-slate-700/70 bg-slate-950 p-0">
                {loading ? (
                    <Loader message="Mise à jour de la courbe..." />
                ) : error ? (
                    <div className="flex h-full w-full items-center justify-center px-4">
                        <p className="text-error">Erreur: {error}</p>
                    </div>
                ) : !hasData ? (
                    <div className="flex h-full w-full items-center justify-center px-4">
                        <p className="text-muted">Aucune donnée disponible pour cette plage.</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#cbd5e1', fontSize: 11 }}
                                axisLine={{ stroke: 'rgba(148,163,184,0.35)' }}
                                tickLine={{ stroke: 'rgba(148,163,184,0.35)' }}
                                minTickGap={20}
                                padding={{ left: 0, right: 0 }}
                                interval="preserveStartEnd"
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
                )}
            </div>
        </div>
    )
}
