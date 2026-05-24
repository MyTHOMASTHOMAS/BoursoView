/**
 * Barrel du module « prix / tendance » : snapshot détaillé, sparkline et helpers exportés pour réutilisation.
 */

// ─── Composant de sortie unifié ───────────────────────────────────────────────
export { TrendHoverCard } from './TrendHoverCard'
export type { TrendHoverCardProps } from './TrendHoverCard'

export { PriceTrendSnapshot } from './PriceTrendSnapshot'
export type { PriceTrendSnapshotProps } from './types'
export { PriceTrendHoverCard } from './PriceTrendHoverCard'
export type { PriceTrendHoverCardProps } from './PriceTrendHoverCard'
export { QuickTrendCurve, segmentColorFromVariance, type SegmentGradientTuple } from './QuickTrendCurve'
export type { VarianceTrendVisual } from './varianceTrendVisual'

// ─── Composants portfolio (Méthode de Dietz Modifiée) ─────────────────────────
export { PortfolioTrendSnapshot } from './PortfolioTrendSnapshot'
export { PortfolioTrendHoverCard } from './PortfolioTrendHoverCard'
export type { PortfolioTrendHoverCardProps } from './PortfolioTrendHoverCard'
export type { PortfolioPeriodSeries } from './types'
