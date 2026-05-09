import { useEffect, useState } from 'react'
import {
    DEFAULT_APP_VARIANCE,
    DISPLAY_VARIANCE_MAX_INCLUSIVE,
    DISPLAY_VARIANCE_MIN_EXCLUSIVE,
    useAppStore
} from '../store/app-store'

function formatVarianceHint(value: number): string {
    if (!Number.isFinite(value)) return ''
    const pct = value * 100
    return `≈ ±${pct % 1 === 0 ? pct.toFixed(0) : pct.toFixed(1)} %`
}

export default function Settings() {
    const defaultVariance = useAppStore((s) => s.defaultVariance)
    const setDefaultVariance = useAppStore((s) => s.setDefaultVariance)

    const [varianceInput, setVarianceInput] = useState(() => String(defaultVariance))

    useEffect(() => {
        setVarianceInput(String(defaultVariance))
    }, [defaultVariance])

    function commitVarianceInput(): void {
        const normalized = varianceInput.trim().replace(',', '.')
        const parsed = Number(normalized)
        if (
            Number.isFinite(parsed) &&
            parsed > DISPLAY_VARIANCE_MIN_EXCLUSIVE &&
            parsed <= DISPLAY_VARIANCE_MAX_INCLUSIVE
        ) {
            setDefaultVariance(parsed)
            return
        }
        setVarianceInput(String(defaultVariance))
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-heading-xl text-primary">Paramètres</h1>
                <p className="mt-1 text-muted">Configuration de votre application.</p>
            </div>

            <section className="glass-card radius-card card-large-padding text-left max-w-2xl">
                <h2 className="text-heading-lg text-text mb-1">Affichage des cours</h2>
                <p className="text-muted text-sm mb-5">
                    Réglages utilisés par les mini-graphiques et les cartes de variation (indices,
                    etc.).
                </p>

                <div className="space-y-2">
                    <label htmlFor="app-variance" className="block text-sm font-medium text-text">
                        Variance par défaut
                    </label>
                    <p className="text-muted text-sm leading-relaxed">
                        Elle fixe l&apos;échelle des mouvements de prix utilisée pour les mini-courbes
                        et les cartes de variation : c&apos;est une variation relative de référence
                        (ex.&nbsp;<strong>0,2</strong> ≈ <strong>±20&nbsp;%</strong> par rapport au
                        prix de référence du segment). Plus la valeur est élevée, plus il faut un
                        mouvement fort avant que les couleurs « saturées » (extrême hausse ou baisse)
                        s&apos;affichent ; plus elle est basse, plus les petites variations ressortent.
                        Plage acceptée&nbsp;: strictement au-dessus de{' '}
                        {DISPLAY_VARIANCE_MIN_EXCLUSIVE} jusqu&apos;à{' '}
                        {DISPLAY_VARIANCE_MAX_INCLUSIVE} ; valeur suggérée&nbsp;:{' '}
                        <strong>{DEFAULT_APP_VARIANCE}</strong>. Enregistrée localement sur cet
                        appareil.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                        <input
                            id="app-variance"
                            type="number"
                            inputMode="decimal"
                            step={0.05}
                            min={DISPLAY_VARIANCE_MIN_EXCLUSIVE + 1e-6}
                            max={DISPLAY_VARIANCE_MAX_INCLUSIVE}
                            className="w-36 rounded-lg border border-primary/30 bg-slate-900/80 px-3 py-2 text-text text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            value={varianceInput}
                            onChange={(e) => setVarianceInput(e.target.value)}
                            onBlur={commitVarianceInput}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.currentTarget.blur()
                                }
                            }}
                            aria-describedby="app-variance-hint"
                        />
                        <span id="app-variance-hint" className="text-muted text-sm tabular-nums">
                            {formatVarianceHint(defaultVariance)}
                        </span>
                    </div>
                </div>
            </section>

            <div className="glass-card radius-card card-large-padding text-center">
                <div className="w-16 h-16 mx-auto radius-card accent-primary-halo flex items-center justify-center mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="w-8 h-8 text-brand"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                    </svg>
                </div>
                <h3 className="text-heading-lg">Autres paramètres</h3>
                <p className="text-muted mt-2 max-w-md mx-auto">
                    D&apos;autres options de configuration seront disponibles prochainement.
                </p>
            </div>
        </div>
    )
}
