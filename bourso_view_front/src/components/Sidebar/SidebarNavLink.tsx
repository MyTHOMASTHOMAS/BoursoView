import type { ReactNode } from 'react'
import { L } from '../../routes/Routes'

interface SidebarNavLinkProps {
    routeName: 'dashboard' | 'indices' | 'achats' | 'transactions' | 'settings'
    label: string
    icon: ReactNode
    expanded: boolean
    onNavigate?: () => void
}

export default function SidebarNavLink({ routeName, label, icon, expanded, onNavigate }: SidebarNavLinkProps) {
    return (
        <L.NavLink
            routeName={routeName}
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200 group relative z-10 hover:z-50
                ${isActive
                    ? 'nav-item-active'
                    : 'text-muted hover:text-primary hover:surface-hover'
                }`
            }
            onClick={onNavigate}
        >
            {({ isActive }) => (
                <>
                    {/* Active indicator */}
                    {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary radius-full" />
                    )}

                    <span className="shrink-0">{icon}</span>

                    <span
                        className={`
                            whitespace-nowrap font-medium text-sm
                            transition-all duration-300
                            ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
                        `}
                    >
                        {label}
                    </span>

                    {/* Tooltip when collapsed */}
                    {!expanded && (
                        <div
                            className="
                                absolute left-full ml-3 px-3 py-1.5 rounded-lg
                                surface-hover text-primary text-small font-medium
                                whitespace-nowrap opacity-0 invisible
                                group-hover:opacity-100 group-hover:visible
                                transition-all duration-200 pointer-events-none
                                shadow-lg shadow-black/20
                                z-50
                            "
                        >
                            {label}
                        </div>
                    )}
                </>
            )}
        </L.NavLink>
    )
}
