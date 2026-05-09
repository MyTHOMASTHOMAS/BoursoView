import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useAppStore } from '../../../store'
import { PriceTrendSnapshot } from '.'
import { QuickTrendCurve } from './QuickTrendCurve'
import { useFloatingOverlay } from '../../common/useFloatingOverlay'

/**
 * Props du bouton déclencheur + overlay : mêmes niveaux de prix que `PriceTrendSnapshot` / sparkline.
 */
export type PriceTrendHoverCardProps = {
    /** Prix spot affiché à droite du sparkline. */
    price: number
    price_j_1: number
    price_j_7: number
    price_m_1: number
    /**
     * Échelle commune sparkline + cartes delta ; si omis, utilise `useAppStore.defaultVariance`
     * (persistée dans le localStorage — voir slice affichage).
     */
    variance?: number
}

/**
 * Bouton inline avec sparkline ; ouvre un panneau flottant (`PriceTrendSnapshot`) via portail.
 *
 * La position est calculée par `useFloatingOverlay` pour rester dans la fenêtre ;
 * un clic extérieur referme l’overlay (comportement géré par le hook).
 */
export function PriceTrendHoverCard({
    price,
    price_j_1,
    price_j_7,
    price_m_1,
    variance
}: PriceTrendHoverCardProps) {
    const defaultVariance = useAppStore((s) => s.defaultVariance)
    const effectiveVariance = variance ?? defaultVariance
    const [isOpen, setIsOpen] = useState(false)
    const {
        containerRef,
        triggerRef,
        overlayRef,
        position,
        updatePosition
    } = useFloatingOverlay({
        width: 340,
        height: 220,
        isOpen,
        onClose: () => setIsOpen(false)
    })

    return (
        <div ref={containerRef} className="relative inline-flex">
            <button
                ref={(el) => {
                    triggerRef.current = el
                }}
                type="button"
                onClick={(event) => {
                    event.stopPropagation()
                    const nextOpen = !isOpen
                    if (nextOpen) {
                        updatePosition()
                    }
                    setIsOpen(nextOpen)
                }}
                className="px-2 py-1 rounded-lg border border-primary/25 bg-gradient-to-r from-primary/20 to-indigo-500/20 text-text hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
                aria-expanded={isOpen}
                aria-label="Afficher le detail de variation du prix"
            >
                <span className="flex items-center gap-2">
                    <QuickTrendCurve
                        price_30_j={price_m_1}
                        price_7_j={price_j_7}
                        price_1_j={price_j_1}
                        price_0_j={price}
                        maxVariancePercent={effectiveVariance}
                    />
                    <span>{price.toFixed(2)}</span>
                </span>
            </button>

            {isOpen &&
                createPortal(
                    <div
                        ref={overlayRef}
                        className="fixed z-[10000] w-[min(92vw,340px)]"
                        style={{ top: `${position.top}px`, left: `${position.left}px` }}
                    >
                        <PriceTrendSnapshot
                            price={price}
                            price_j_1={price_j_1}
                            price_j_7={price_j_7}
                            price_m_1={price_m_1}
                            variance={effectiveVariance}
                        />
                    </div>,
                    document.body
                )}
        </div>
    )
}
