import { DirectionArrowIcon } from '../../icons/DirectionArrowIcon'
import { formatSignedAmount, formatSignedPercent } from './formatting'
import { trendVisualFromVariance } from './varianceTrendVisual'

/**
 * Props d’une carte compacte : une ligne du snapshot (1j, 7j, 1 mois).
 */
type TrendDeltaCardProps = {
    /** Libellé affiché en haut de la carte. */
    label: string
    /** Prix actuel (fin du segment). */
    price: number
    /** Prix de référence au début du segment. */
    reference: number
    /** Paramètre `variance` partagé avec le sparkline pour une échelle comparable. */
    variance: number
    /** Nombre de jours du segment pour `getVarianceGradientIndex`. */
    segmentDays: number
}

/**
 * Carte centrée : variation en %, montant signé, pilule et flèche colorées selon l’indice de variance.
 *
 * Les couleurs et l’orientation de la flèche viennent de `trendVisualFromVariance`, pas de seuils Tailwind fixes.
 * Si `isExtreme`, pilule et montant utilisent `animate-variance-extreme` (indice saturé à la variance affichée).
 */
export function TrendDeltaCard({ label, price, reference, variance, segmentDays }: TrendDeltaCardProps) {
    const delta = price - reference
    const deltaPercent = reference !== 0 ? (delta / reference) * 100 : Number.NaN
    const { color, arrowRotationDeg, isExtreme } = trendVisualFromVariance(reference, price, variance, segmentDays)
    const blinkClass = isExtreme ? 'animate-variance-extreme' : ''

    return (
        <div className="flex flex-col items-center text-center flex-1 basis-[90px] min-w-[88px] rounded-xl bg-slate-900 border border-white/10 p-2 sm:p-3 space-y-1.5 sm:space-y-2">
            <div className="text-[11px] sm:text-xs text-text-muted w-full">{label}</div>
            <div
                className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium border bg-slate-950/50 ${blinkClass}`}
                style={{ borderColor: color, color }}
            >
                <DirectionArrowIcon rotation={arrowRotationDeg} color={color} size={12} className="shrink-0" />
                <span>{formatSignedPercent(deltaPercent)}</span>
            </div>
            <div className={`text-[11px] sm:text-sm font-medium ${blinkClass}`} style={{ color }}>
                {formatSignedAmount(delta)}
            </div>
        </div>
    )
}
