export default function Transactions() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-heading-xl text-primary">Transactions</h1>
                <p className="mt-1 text-muted">
                    Historique de toutes vos opérations.
                </p>
            </div>

            <div className="glass-card radius-card card-large-padding text-center">
                <div className="w-16 h-16 mx-auto radius-card accent-primary-halo flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-brand">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                </div>
                <h3 className="text-heading-lg">Aucune transaction</h3>
                <p className="text-muted mt-2 max-w-md mx-auto">
                    Vos transactions apparaîtront ici une fois votre compte connecté.
                </p>
            </div>
        </div>
    )
}
