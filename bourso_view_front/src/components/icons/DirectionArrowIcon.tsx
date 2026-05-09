import type { JSX } from 'react'

type DirectionArrowIconProps = {
    /**
     * Rotation en degrés autour du centre du pictogramme.
     * 0 = nord (pointe vers le haut). Sens horaire positif (SVG).
     */
    rotation?: number
    /** Couleur de remplissage. @default 'currentColor' */
    color?: string
    /** Taille en pixels (largeur et hauteur identiques). @default 24 */
    size?: number
    /** Classes Tailwind optionnelles (ex. shrink-0). La taille reste pilotée par `size`. */
    className?: string
}

/**
 * Flèche directionnelle en SVG : orientation par défaut vers le nord (haut).
 */
export function DirectionArrowIcon({
    rotation = 0,
    color = 'currentColor',
    size = 24,
    className = ''
}: DirectionArrowIconProps): JSX.Element {
    const center = 12

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill={color}
            className={className}
            aria-hidden
        >
            <g transform={`rotate(${rotation}, ${center}, ${center})`}>
                <path d="M12 2 L21 16 L17 19 L12 14 L7 19 L3 16 Z" />
            </g>
        </svg>
    )
}
