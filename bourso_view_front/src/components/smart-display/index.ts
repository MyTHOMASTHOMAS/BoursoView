/**
 * Composants affichage intelligent : snapshot de tendance prix, sparkline et carte hover associée.
 */
export {
    PriceTrendSnapshot,
    type PriceTrendSnapshotProps,
    QuickTrendCurve,
    segmentColorFromVariance,
    type SegmentGradientTuple,
    type VarianceTrendVisual
} from './price-trend-snapshot'
export { PriceTrendHoverCard, type PriceTrendHoverCardProps } from './price-trend-snapshot/PriceTrendHoverCard'
