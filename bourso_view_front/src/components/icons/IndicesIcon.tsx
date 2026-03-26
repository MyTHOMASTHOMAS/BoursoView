import type { JSX } from 'react'

interface IconProps {
    className?: string
}

export function IndicesIcon({ className = 'w-5 h-5' }: IconProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            {/* Tracé ultra-simplifié pour une netteté maximale : deux barres nettes pour les indices */}
            <path d="M 6 18 V 10 M 12 18 V 6 M 18 18 V 14" />
        </svg>
    )
}