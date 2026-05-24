/**
 * @file DashboardSummary.tsx
 * @description Composer principal du résumé du portefeuille.
 *
 * Assemble les 4 sous-cartes :
 * - `PerformanceCard` — investi vs estimé + PnL + PriceTrendHoverCard
 * - `FundCard`        — total versé, disponible, engagé
 * - `PositionCard`    — titres, PRU, valeur brute, frais
 * - `DividendesCard`  — versements brut/net, taxe
 *
 * @remarks
 * Lors de l'intégration réelle, remplacer `data` par la réponse du hook `useResume`.
 */
import { FundCard } from './summary/FundCard'
import { PositionCard } from './summary/PositionCard'
import { PerformanceCard } from './summary/PerformanceCard'
import { DividendesCard } from './summary/DividendesCard'
import type { DashboardSummaryData } from '../data/dashboardMockData'

type DashboardSummaryProps = {
    data: DashboardSummaryData
}

/**
 * Résumé complet du portefeuille en 4 cartes disposées en grille responsive.
 *
 * Layout :
 * - Mobile      : 1 colonne
 * - Tablette    : 2 colonnes
 * - Desktop     : PerformanceCard pleine largeur + 3 colonnes pour les 3 autres
 */
export function DashboardSummary({ data }: DashboardSummaryProps) {
    return (
        <div className="space-y-4">
            {/* PerformanceCard : pleine largeur pour mettre en avant la PnL */}
            <PerformanceCard total={data.transaction.total} />

            {/* 3 cartes secondaires en grille */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FundCard data={data} />
                <PositionCard transaction={data.transaction} />
                <DividendesCard dividendes={data.dividendes} />
            </div>
        </div>
    )
}
