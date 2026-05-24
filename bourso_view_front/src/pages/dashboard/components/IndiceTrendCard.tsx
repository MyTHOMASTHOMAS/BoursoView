import {
    PortfolioTrendHoverCard,
    PriceTrendHoverCard,
} from '../../../components/smart-display'
import { useAppStore } from '../../../store'
import type { ResponseType as RT } from 'Shared/RouteType'

type IndiceTrendCardProps = {
    indice: RT.ReferentielItem
}

/**
 * Carte tendance d’un référentiel : cours (prix) ou marché (invest / estimated + Dietz).
 */
export function IndiceTrendCard({ indice }: IndiceTrendCardProps) {
    const trendMode = useAppStore((s) => s.dashboardIndicesTrendMode)
    const { price, totals } = indice
    const { invest, estimated } = totals.transaction.total

    if (trendMode === 'portfolio') {
        return (
            <PortfolioTrendHoverCard
                estimated={estimated}
                invest={invest}
            />
        )
    }

    return (
        <PriceTrendHoverCard
            price={price.current}
            price_j_1={price.j1}
            price_j_7={price.j7}
            price_m_1={price.j30}
            price_m_6={price.m6}
            price_y_1={price.y1}
        />
    )
}
