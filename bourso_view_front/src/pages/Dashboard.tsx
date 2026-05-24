/**
 * @file Dashboard.tsx
 * @description Page d'accueil — template de prévisualisation avec données statiques.
 *
 * Architecture des composants :
 * - `DashboardHeader`        → En-tête avec titre et date de mise à jour
 * - `DashboardPortfolioCard` → Carte valorisation totale
 * - `DashboardTopIndices`    → Referentiels — liste horizontale avec PriceTrendHoverCard
 * - `DashboardSummary`       → Résumé (Performance Dietz, Fonds, Positions, Dividendes)
 */
import { DashboardHeader } from './dashboard/components/DashboardHeader'
import { DashboardPortfolioCard } from './dashboard/components/DashboardPortfolioCard'
import { DashboardTopIndices } from './dashboard/components/DashboardTopIndices'
import { DashboardSummary } from './dashboard/components/DashboardSummary'
import {
    MOCK_TOP_INDICES,
    MOCK_SUMMARY,
} from './dashboard/data/dashboardMockData'
import { format } from '../utils/math'

export default function Dashboard() {
    return (
        <div className="space-y-6">
            {/* En-tête */}
            <DashboardHeader />

            {/* Carte de valorisation + Referentiels */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                <div className="xl:col-span-2">
                    <DashboardPortfolioCard
                        totalValue={format(MOCK_SUMMARY.transaction.total.estimated.current)}
                        totalDelta="+11,6 %"
                        total={MOCK_SUMMARY.transaction.total}
                    />
                </div>
                <div className="xl:col-span-3">
                    <DashboardTopIndices indices={MOCK_TOP_INDICES} />
                </div>
            </div>

            {/* Résumé du portefeuille */}
            <DashboardSummary data={MOCK_SUMMARY} />
        </div>
    )
}
