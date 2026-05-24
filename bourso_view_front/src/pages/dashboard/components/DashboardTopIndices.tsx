/**
 * @file DashboardTopIndices.tsx
 * @description Liste horizontale défilante des referentiels du portefeuille.
 *
 * Affiche uniquement le nom de l'indice et son `PriceTrendHoverCard`
 * (sparkline cliquable → popup snapshot 1j / 7j / 1 mois).
 */
import { Loader } from '../../../components/loading'
import { PriceTrendHoverCard } from '../../../components/smart-display'
import { L } from '../../../routes/Routes'
import type { ResponseType as RT } from 'Shared/RouteType'

type DashboardTopIndicesProps = {
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

            <PriceTrendHoverCard
                price={indice.price}
                price_j_1={indice.estimated_j_1}
                price_j_7={indice.estimated_j_7}
                price_m_1={indice.estimated_1_mois}
            />
        </div>
    )
}

export function DashboardTopIndices({
    indices,
    loading = false,
    error = null,
    onRetry,
}: DashboardTopIndicesProps) {
    return (
        <div className="glass-card radius-card p-5 space-y-3">
            <div className="flex items-center justify-between gap-4">
                <p className="text-muted text-small font-medium">Referentiels</p>
                <L.Link
                    routeName="indices"
                    className="text-small text-muted hover:text-primary transition-colors shrink-0"
                >
                    Voir tout →
                </L.Link>
            </div>

            {loading && (
                <Loader message="Chargement des referentiels..." />
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
                <p className="text-muted text-small py-2">Aucun referentiel disponible.</p>
            )}

            {!loading && !error && indices.length > 0 && (
                <div className="scrollbar-thin flex gap-3 overflow-x-auto pb-2">
                    {indices.map((indice) => (
                        <IndiceItem key={indice.id} indice={indice} />
                    ))}
                </div>
            )}
        </div>
    )
}
