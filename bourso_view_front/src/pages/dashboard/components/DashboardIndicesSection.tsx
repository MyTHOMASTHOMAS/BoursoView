/**
 * @file DashboardIndicesSection.tsx
 * @description Bandeau horizontal des référentiels mis en avant + bascule cours / marché.
 */
import { Loader } from '../../../components/loading'
import { L } from '../../../routes/Routes'
import type { ResponseType as RT } from 'Shared/RouteType'
import { DashboardIndicesTrendToggle } from './DashboardIndicesTrendToggle'
import { IndiceTrendCard } from './IndiceTrendCard'

type DashboardIndicesSectionProps = {
    indices: RT.ReferentielItem[]
    loading?: boolean
    error?: string | null
    onRetry?: () => void
}

function IndiceItem({ indice }: { indice: RT.ReferentielItem }) {
    return (
        <div className="flex flex-col items-start gap-2 shrink-0 px-4 py-3 rounded-xl border border-white/5 bg-white/[0.03] hover:border-primary/30 hover:bg-white/[0.05] transition-all duration-200">
            <div>
                <p className="text-small font-semibold text-primary whitespace-nowrap">{indice.id}</p>
                <p className="text-[11px] text-muted whitespace-nowrap max-w-[140px] truncate">{indice.name}</p>
            </div>
            <IndiceTrendCard indice={indice} />
        </div>
    )
}

export function DashboardIndicesSection({
    indices,
    loading = false,
    error = null,
    onRetry,
}: DashboardIndicesSectionProps) {
    return (
        <div className="glass-card radius-card p-5 flex flex-col gap-3 h-full w-full min-h-[12rem]">
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                    <p className="text-muted text-small font-medium">Indices</p>
                    <DashboardIndicesTrendToggle />
                </div>
                <L.Link
                    routeName="indices"
                    className="text-small text-muted hover:text-primary transition-colors shrink-0 pt-0.5"
                >
                    Voir tout →
                </L.Link>
            </div>

            {loading && (
                <Loader message="Chargement des référentiels..." />
            )}

            {!loading && error && (
                <div className="space-y-3 text-center py-2">
                    <p className="text-error text-small">{error}</p>
                    {onRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="btn-padding radius-btn border border-subtle text-primary hover:surface-hover transition-colors cursor-pointer"
                        >
                            Réessayer
                        </button>
                    )}
                </div>
            )}

            {!loading && !error && indices.length === 0 && (
                <p className="text-muted text-small py-2">Aucun référentiel disponible.</p>
            )}

            {!loading && !error && indices.length > 0 && (
                <div className="scrollbar-thin flex flex-1 min-h-0 gap-3 overflow-x-auto pb-2 items-stretch">
                    {indices.map((indice) => (
                        <IndiceItem key={indice.id} indice={indice} />
                    ))}
                </div>
            )}
        </div>
    )
}
