import type { JSX } from 'react'

interface IconProps {
    className?: string
}

export function ChevronLeftIcon({ className = 'w-5 h-5' }: IconProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M15 18l-6-6 6-6" />
        </svg>
    )
}
