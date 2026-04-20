type PageLoaderProps = {
    message?: string
}

/**
 * Wrapper spécialisé pour les loaders de page.
 */
import { Loader } from './Loader'

export function PageLoader({
    message = 'Connexion au serveur...'
}: PageLoaderProps) {
    return (
        <div className="flex h-screen w-screen items-center justify-center surface-main text-primary">
            <Loader message={message} />
        </div>
    )
}
