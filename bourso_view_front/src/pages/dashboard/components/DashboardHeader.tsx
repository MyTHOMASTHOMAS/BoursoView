/**
 * @file DashboardHeader.tsx
 * @description En-tête de la page Dashboard : titre, sous-titre et date de mise à jour.
 */

type DashboardHeaderProps = {
    title?: string
    subtitle?: string
    lastUpdated?: string
}

/**
 * En-tête de la page d'accueil avec le titre principal et la date de mise à jour.
 */
export function DashboardHeader({
    title = 'Dashboard',
    subtitle = 'Vue d\'ensemble de votre portefeuille et activité récente.',
    lastUpdated = '24 mai 2026 — 10:30',
}: DashboardHeaderProps) {
    return (
        <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
                <h1 className="text-heading-xl text-primary">{title}</h1>
                <p className="mt-1 text-muted">{subtitle}</p>
            </div>
            <div className="glass-card radius-btn px-3 py-1.5 flex items-center gap-2 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" style={{ boxShadow: '0 0 6px #34d399' }} />
                <span className="text-small text-muted">Mis à jour le {lastUpdated}</span>
            </div>
        </div>
    )
}
