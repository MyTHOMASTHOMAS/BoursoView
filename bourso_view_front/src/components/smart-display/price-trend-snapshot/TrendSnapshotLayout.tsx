import type { ReactNode } from 'react'

export type TrendSnapshotLayoutProps = {
    /** Libellé de l'en-tête (ex. « Prix actuel », « Valorisation estimée »). */
    headerLabel: string
    /** Valeur affichée à droite de l'en-tête. */
    headerValue: ReactNode
    /** Si fourni, ajoute `data-variance` sur le conteneur (mode prix). */
    variance?: number
    className?: string
    /** Contenu optionnel sous la rangée de cartes (ex. note Dietz). */
    footer?: ReactNode
    children: ReactNode
}

/**
 * Coquille visuelle partagée par `PriceTrendSnapshot` et `PortfolioTrendSnapshot`.
 */
export function TrendSnapshotLayout({
    headerLabel,
    headerValue,
    variance,
    className = '',
    footer,
    children,
}: TrendSnapshotLayoutProps) {
    return (
        <div
            className={`w-full rounded-2xl border border-primary/25 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-3 sm:p-4 space-y-3 shadow-card ${className}`}
            {...(variance !== undefined ? { 'data-variance': variance } : {})}
        >
            <div className="flex items-baseline justify-between gap-3">
                <span className="text-text-muted text-xs sm:text-sm">{headerLabel}</span>
                <span className="text-text text-base sm:text-lg font-semibold tabular-nums">
                    {headerValue}
                </span>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">{children}</div>

            {footer}
        </div>
    )
}
