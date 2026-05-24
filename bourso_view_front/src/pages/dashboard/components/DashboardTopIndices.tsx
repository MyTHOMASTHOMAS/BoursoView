/**
 * @file DashboardTopIndices.tsx
 * @description Liste horizontale défilante des referentiels du portefeuille.
 *
 * Affiche uniquement le nom de l'indice et son `PriceTrendHoverCard`
 * (sparkline cliquable → popup snapshot 1j / 7j / 1 mois).
 *
 * @remarks
 * Lors de l'intégration réelle, remplacer `indices` par le résultat de `useReferentiel`.
 */
import { PriceTrendHoverCard } from '../../../components/smart-display'
import { L } from '../../../routes/Routes'
import type { MockIndiceRow } from '../data/dashboardMockData'

type DashboardTopIndicesProps = {
    indices: MockIndiceRow[]
}

/**
 * Carte minimaliste pour un referentiel : nom + PriceTrendHoverCard.
 */
function IndiceItem({ indice }: { indice: MockIndiceRow }) {
    return (
        <div className="flex flex-col items-start gap-2 shrink-0 px-4 py-3 rounded-xl border border-white/5 bg-white/[0.03] hover:border-primary/30 hover:bg-white/[0.05] transition-all duration-200">
            {/* Nom + ID */}
            <div>
                <p className="text-small font-semibold text-primary whitespace-nowrap">{indice.id}</p>
                <p className="text-[11px] text-muted whitespace-nowrap max-w-[140px] truncate">{indice.name}</p>
            </div>

            {/* Widget trend */}
            <PriceTrendHoverCard
                price={indice.price}
                price_j_1={indice.price_j_1}
                price_j_7={indice.price_j_7}
                price_m_1={indice.price_m_1}
            />
        </div>
    )
}

/**
 * Liste horizontale défilante des referentiels.
 * Chaque item affiche le nom de l'indice et le `PriceTrendHoverCard`.
 */
export function DashboardTopIndices({ indices }: DashboardTopIndicesProps) {
    return (
        <div className="glass-card radius-card p-5 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <p className="text-muted text-small font-medium">Referentiels</p>
                <L.Link
                    routeName="indices"
                    className="text-small text-muted hover:text-primary transition-colors shrink-0"
                >
                    Voir tout →
                </L.Link>
            </div>

            {/* Liste horizontale */}
            <div className="scrollbar-thin flex gap-3 overflow-x-auto pb-2">
                {indices.map((indice) => (
                    <IndiceItem key={indice.id} indice={indice} />
                ))}
            </div>
        </div>
    )
}
