type LoaderProps = {
    message?: string
}

/**
 * Loader générique réutilisable (contenu uniquement).
 * L'animation est portée par SVG (SMIL) pour éviter toute dépendance CSS.
 */
export function Loader({
    message = 'Chargement...'
}: LoaderProps) {
    return (
        <div className="flex w-full min-h-[220px] items-center justify-center text-primary">
            <div className="flex flex-col items-center gap-4">
                <svg
                    className="h-10 w-10 text-primary"
                    viewBox="0 0 50 50"
                    role="status"
                    aria-label="Chargement"
                >
                    <circle
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="90 150"
                    >
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 25 25"
                            to="360 25 25"
                            dur="1s"
                            repeatCount="indefinite"
                        />
                    </circle>
                </svg>
                <p className="font-medium">{message}</p>
            </div>
        </div>
    )
}
