export default function Dashboard() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-heading-xl text-primary">Dashboard</h1>
                <p className="mt-1 text-muted">
                    Vue d'ensemble de votre portefeuille et activité récente.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Valeur totale', value: '—', change: null },
                    { label: 'Gains / Pertes', value: '—', change: null },
                    { label: 'Transactions', value: '—', change: null },
                    { label: 'Positions', value: '—', change: null },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="
              glass-card
              radius-card p-5
              hover:border-primary transition-all duration-300
              group
            "
                    >
                        <p className="text-muted text-small font-medium">{stat.label}</p>
                        <p className="text-heading-lg text-primary mt-2 group-hover:text-primary-light transition-colors">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Placeholder Content */}
            <div className="glass-card radius-card card-large-padding text-center">
                <div className="w-16 h-16 mx-auto radius-card accent-primary-halo flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-brand">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                    </svg>
                </div>
                <h3 className="text-heading-lg">Données à venir</h3>
                <p className="text-muted mt-2 max-w-md mx-auto">
                    Connectez votre API pour afficher vos données de portefeuille, graphiques et analyses.
                </p>
            </div>
        </div>
    )
}
