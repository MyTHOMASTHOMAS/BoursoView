import { L } from '../routes/Routes'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="space-y-2">
                <h1 className="font-bold text-[4rem] md:text-[5rem] bg-gradient-primary bg-clip-text text-transparent">
                    404
                </h1>
                <p className="text-xl text-primary font-semibold">Page introuvable</p>
                <p className="text-muted max-w-md">
                    La page que vous recherchez n'existe pas ou a été déplacée.
                </p>
            </div>

            <L.Link
                routeName="dashboard"
                className="
          inline-flex items-center gap-2 btn-large-padding radius-btn
          btn-primary
          transition-all duration-200
          shadow-primary
        "
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
                Retour à l'accueil
            </L.Link>
        </div>
    )
}
