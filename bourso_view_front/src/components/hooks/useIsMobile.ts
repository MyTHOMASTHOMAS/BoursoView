/**
 * @file useIsMobile.ts
 * @description Hook React réactif pour détecter si l'écran est en mode mobile.
 * Utilise `window.matchMedia` pour écouter les changements de taille d'écran
 * de manière performante (pas de listener `resize`).
 */
import { useState, useEffect } from 'react'

/**
 * Détecte si la largeur de l'écran est inférieure au breakpoint donné.
 *
 * @param breakpoint - Largeur en pixels en dessous de laquelle on considère l'écran comme mobile. Par défaut : `650`.
 * @returns `true` si la largeur de l'écran est inférieure au breakpoint, `false` sinon.
 *
 * @example
 * ```tsx
 * const isMobile = useIsMobile();     // < 650px
 * const isTablet = useIsMobile(1024); // < 1024px
 * ```
 */
export function useIsMobile(breakpoint = 650): boolean {
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
    )

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)

        setIsMobile(mql.matches)
        mql.addEventListener('change', handler)
        return () => mql.removeEventListener('change', handler)
    }, [breakpoint])

    return isMobile
}
