import { useAppStore } from '../../../store'
import type { DashboardIndicesTrendMode } from '../../../store/app-store'

const OPTIONS: { mode: DashboardIndicesTrendMode; label: string; description: string }[] = [
    {
        mode: 'price',
        label: 'Cours',
        description: 'Variation du prix de l’indice (références historiques du cours)',
    },
    {
        mode: 'portfolio',
        label: 'Marché',
        description: 'Variation de marché corrigée des apports (Méthode de Dietz modifiée)',
    },
]

type DashboardIndicesTrendToggleProps = {
    className?: string
}

/**
 * Bascule le mode de tendance des référentiels (persisté dans le localStorage, hors Paramètres).
 */
export function DashboardIndicesTrendToggle({ className = '' }: DashboardIndicesTrendToggleProps) {
    const mode = useAppStore((s) => s.dashboardIndicesTrendMode)
    const setMode = useAppStore((s) => s.setDashboardIndicesTrendMode)

    return (
        <div
            className={`inline-flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5 ${className}`}
            role="group"
            aria-label="Type d’affichage des tendances"
        >
            {OPTIONS.map(({ mode: optionMode, label, description }) => {
                const active = mode === optionMode
                return (
                    <button
                        key={optionMode}
                        type="button"
                        title={description}
                        aria-pressed={active}
                        onClick={() => setMode(optionMode)}
                        className={`
                            px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer
                            ${active
                                ? 'bg-primary/20 text-primary border border-primary/30'
                                : 'text-muted hover:text-primary hover:bg-white/[0.04] border border-transparent'
                            }
                        `}
                    >
                        {label}
                    </button>
                )
            })}
        </div>
    )
}
