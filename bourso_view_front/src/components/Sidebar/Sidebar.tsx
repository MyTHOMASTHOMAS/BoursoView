import { useSidebarContext } from '../../features/sidebar/SidebarProvider'
import { useIsMobile } from '../hooks/useIsMobile'
import { DashboardIcon, IndicesIcon, TransactionsIcon, SettingsIcon, ChevronLeftIcon, UserIcon } from '../icons'
import SidebarNavLink from './SidebarNavLink'

const navItems = [
    { routeName: 'dashboard' as const, label: 'Dashboard', icon: <DashboardIcon /> },
    { routeName: 'indices' as const, label: 'Indices', icon: <IndicesIcon /> },
    { routeName: 'transactions' as const, label: 'Transactions', icon: <TransactionsIcon /> },
    { routeName: 'settings' as const, label: 'Paramètres', icon: <SettingsIcon /> },
]

export default function Sidebar() {
    const { isOpen: expanded, toggle, open, close } = useSidebarContext()
    const isMobile = useIsMobile()

    // On mobile: when closed, sidebar is fully hidden
    // When open: sidebar overlays the page
    if (isMobile) {
        return (
            <>
                {/* Floating open button — visible only when sidebar is closed */}
                {!expanded && (
                    <button
                        onClick={open}
                        className="
                            fixed bottom-4 left-4 z-50
                            w-12 h-12 radius-btn
                            bg-primary backdrop-blur-sm
                            text-white shadow-primary
                            flex items-center justify-center
                            hover:bg-primary transition-all duration-200
                            cursor-pointer
                        "
                        aria-label="Ouvrir le menu"
                    >
                        <DashboardIcon className="w-5 h-5" />
                    </button>
                )}

                {/* Backdrop overlay */}
                {expanded && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
                        onClick={close}
                    />
                )}

                {/* Sidebar — fixed overlay */}
                <aside
                    className={`
                        fixed top-0 left-0 z-50 h-screen w-64
                        flex flex-col
                        surface-light backdrop-blur-xl
                        border-r border-subtle
                        transition-transform duration-300 ease-in-out
                        ${expanded ? 'translate-x-0' : '-translate-x-full'}
                    `}
                >
                    {/* Header */}
                    <div className="flex items-center h-16 px-4 border-b border-subtle">
                        <div className="flex items-center gap-3 w-full">
                            <div className="w-8 h-8 radius-btn bg-gradient-primary flex items-center justify-center shrink-0">
                                <span className="text-white font-bold text-sm">B</span>
                            </div>
                            <span className="text-primary font-semibold text-lg">BoursoView</span>
                        </div>
                        <button
                            onClick={close}
                            className="p-2 radius-btn text-muted hover:text-primary hover:surface-hover transition-all duration-200 cursor-pointer shrink-0"
                            aria-label="Fermer le menu"
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-4 px-3 space-y-1">
                        {navItems.map((item) => (
                            <SidebarNavLink
                                key={item.routeName}
                                routeName={item.routeName}
                                label={item.label}
                                icon={item.icon}
                                expanded={true}
                                onNavigate={close}
                            />
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-3 border-t border-subtle">
                        <div className="flex items-center gap-3 px-3 py-2.5 radius-btn text-muted">
                            <div className="w-8 h-8 radius-full bg-gradient-primary-subtle flex items-center justify-center shrink-0">
                                <UserIcon />
                            </div>
                            <span className="text-sm font-medium">Utilisateur</span>
                        </div>
                    </div>
                </aside>
            </>
        )
    }

    // Desktop: normal sticky sidebar
    return (
        <aside
            className={`
                flex flex-col h-screen sticky top-0 z-30
                surface-light backdrop-blur-xl
                border-r border-subtle
                transition-all duration-300 ease-in-out
                ${expanded ? 'w-64' : 'w-[72px]'}
            `}
        >
            {/* Header */}
            <div className="flex items-center h-16 px-4 border-b border-subtle">
                <div className={`flex items-center gap-3 overflow-hidden ${expanded ? 'w-full' : 'w-0'}`}>
                    <div className="w-8 h-8 radius-btn bg-gradient-primary flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-sm">B</span>
                    </div>
                    <span className="text-primary font-semibold text-lg whitespace-nowrap transition-opacity duration-200">
                        BoursoView
                    </span>
                </div>

                <button
                    onClick={toggle}
                    className={`
                        p-2 radius-btn text-muted hover:text-primary
                        hover:surface-hover transition-all duration-200
                        cursor-pointer shrink-0
                        ${expanded ? 'ml-auto' : 'mx-auto'}
                    `}
                    aria-label={expanded ? 'Réduire le menu' : 'Ouvrir le menu'}
                >
                    <ChevronLeftIcon
                        className={`w-5 h-5 transition-transform duration-300 ${expanded ? '' : 'rotate-180'}`}
                    />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1">
                {navItems.map((item) => (
                    <SidebarNavLink
                        key={item.routeName}
                        routeName={item.routeName}
                        label={item.label}
                        icon={item.icon}
                        expanded={expanded}
                    />
                ))}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-subtle">
                <div className="flex items-center gap-3 px-3 py-2.5 radius-btn text-muted">
                    <div className="w-8 h-8 radius-full bg-gradient-primary-subtle flex items-center justify-center shrink-0">
                        <UserIcon />
                    </div>
                    <span
                        className={`
                            text-sm font-medium whitespace-nowrap
                            transition-all duration-300
                            ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
                        `}
                    >
                        Utilisateur
                    </span>
                </div>
            </div>
        </aside>
    )
}
