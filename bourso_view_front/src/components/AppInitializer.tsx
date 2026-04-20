import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAppStore } from '../store'
import { api } from '../api/api'
import { PageLoader } from './loading'

/**
 * Composant responsable de l'initialisation de l'application.
 * Il vérifie l'état du backend et l'authentification de l'utilisateur
 * en parallèle au montage de l'application.
 */
export function AppInitializer() {
    const { backOnline, setBackOnline, userValid, setUserValid, token, setToken } = useAppStore()

    // Mutation GET pour le healthcheck
    const checkHealth = api.health.useMutation.get({
        onSuccess: (response) => setBackOnline(response?.success === true),
        onError: () => setBackOnline(false)
    })

    // Mutation POST pour l'authentification
    const checkAuth = api.auth.useMutation.post({
        onSuccess: (response) => setUserValid(response?.success === true),
        onError: () => setUserValid(false)
    })

    useEffect(() => {
        // Lancer les deux vérifications en parallèle au montage
        checkHealth.mutate({})

        if (token) {
            checkAuth.mutate({ body: { authToken: token } })
        } else {
            // Aucun token présent : l'utilisateur n'est pas authentifié
            setUserValid(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const newToken = formData.get('token') as string
        if (newToken) {
            setToken(newToken)
            checkAuth.mutate({ body: { authToken: newToken } })
        }
    }

    const isInitializing = checkHealth.isPending || checkAuth.isPending

    // 1. Écran de chargement initialisé
    // On affiche l'écran de chargement si les requêtes sont en cours ET qu'on n'a pas encore de certitude (token/backend null)
    if ((backOnline === null && userValid === null) || isInitializing) {
        return <PageLoader message="Connexion au serveur..." />
    }

    // 2. Erreur d'Authentification (Prioritaire)
    // On affiche la modale si l'utilisateur n'est pas valide (erreur ou token manquant)
    if (!token || userValid === false) {
        const isError = userValid === false && token;

        return (
            <div className="flex h-screen w-screen items-center justify-center surface-main text-primary">
                <div className="flex flex-col items-center gap-4 text-center max-w-md w-full card-large-padding surface-light radius-card border-primary shadow-card m-4">
                    <div className="h-16 w-16 text-primary mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    </div>
                    <h2 className="text-heading-lg">Authentification requise</h2>
                    <p className="text-small text-muted">
                        {isError
                            ? "Votre précédent token est invalide ou a expiré. Veuillez mettre à jour votre jeton d'accès."
                            : "Veuillez entrer votre jeton d'accès pour vous connecter au serveur."}
                    </p>

                    {checkAuth.isError && (
                        <p className="text-error font-medium text-small mt-2">Authentification échouée. Veuillez vérifier votre jeton.</p>
                    )}

                    <form onSubmit={handleTokenSubmit} className="flex flex-col gap-4 w-full mt-4">
                        <input
                            name="token"
                            type="password"
                            placeholder="Votre token secret..."
                            className="w-full btn-large-padding border-subtle radius-btn surface-main focus:outline-none focus:border-primary transition-colors text-center font-medium tracking-wide"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full btn-primary btn-large-padding radius-btn shadow-primary transition-colors font-medium"
                        >
                            Se connecter
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    // 3. Erreur de Healthcheck (Affichée seulement si l'auth est OK mais le serveur injoignable)
    if (backOnline === false) {
        return (
            <div className="flex h-screen w-screen items-center justify-center surface-main text-primary">
                <div className="flex flex-col items-center gap-4 text-center max-w-md card-padding surface-light radius-card border-error shadow-error">
                    <div className="h-16 w-16 text-error">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-heading-lg">Service indisponible</h2>
                    <p className="text-muted">Le serveur principal est injoignable. Veuillez vérifier votre connexion ou réessayer plus tard.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 btn-primary btn-padding radius-btn transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        )
    }

    // 4. Tout est validé, on affiche l'application
    if (backOnline === true && userValid === true) {
        return <Outlet />
    }

    return null
}
