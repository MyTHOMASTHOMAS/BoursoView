/**
 * @file DashboardSummary.tsx
 * @description Cartes métier du résumé (sous la ligne portefeuille / référentiels).
 */
import { FundCard } from './summary/FundCard'
import { PositionCard } from './summary/PositionCard'
import { PerformanceCard } from './summary/PerformanceCard'
import { DividendesCard } from './summary/DividendesCard'
import type { ResponseType as RT } from 'Shared/RouteType'

type DashboardSummaryProps = {
    data: RT.GetResumeAction
}

export function DashboardSummary({ data }: DashboardSummaryProps) {
    return (
        <div className="flex flex-col gap-4 w-full">
            <PerformanceCard total={data.transaction.total} />

            <div className="flex flex-col sm:flex-row gap-4 items-stretch w-full">
                <div className="flex flex-1 min-w-0">
                    <FundCard data={data} />
                </div>
                <div className="flex flex-1 min-w-0">
                    <PositionCard transaction={data.transaction} />
                </div>
                <div className="flex flex-1 min-w-0">
                    <DividendesCard dividendes={data.dividendes} />
                </div>
            </div>
        </div>
    )
}
