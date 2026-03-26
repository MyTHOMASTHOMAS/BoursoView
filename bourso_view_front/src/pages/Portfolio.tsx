export default function Portfolio() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-heading-xl text-primary">Portfolio</h1>
                <p className="mt-1 text-muted">
                    Suivi de vos actifs et performances.
                </p>
            </div>

            <div className="glass-card radius-card card-large-padding text-center">
                <div className="w-16 h-16 mx-auto radius-card accent-primary-halo flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-brand">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5M18 12a2 2 0 0 0 0 4h4v-4Z" />
                    </svg>
                </div>
                <h3 className="text-heading-lg">Portfolio à configurer</h3>
                <p className="text-muted mt-2 max-w-md mx-auto">
                    Ajoutez vos positions pour commencer le suivi de votre portefeuille.
                </p>
            </div>
        </div>
    )
}
