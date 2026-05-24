/**
 * @file TrendHoverCard.tsx
 * @description Composant de sortie unifié : bouton sparkline + panneau flottant.
 *
 * Ce composant est la **couche d'affichage partagée** entre `PriceTrendHoverCard`
 * et `PortfolioTrendHoverCard`. Il ne calcule aucune valeur ; il reçoit :
 * - Les 4 points du sparkline (déjà calculés par le wrapper appelant)
 * - La valeur affichée dans le bouton
 * - Le contenu du panneau popup (ReactNode — PriceTrendSnapshot ou PortfolioTrendSnapshot)
 */
import type { ReactNode } from 'react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { QuickTrendCurve } from './QuickTrendCurve'
import { useFloatingOverlay } from '../../common/useFloatingOverlay'

export type TrendHoverCardProps = {
    /** Valeurs du sparkline (déjà calculées — brutes ou ajustées Dietz selon le mode). */
    sparkline: {
        p0:  number   // prix courant
        p1:  number   // référence J-1
        p7:  number   // référence J-7
        p30: number   // référence J-30 / 1 mois
    }
    /** Texte affiché à droite du sparkline dans le bouton. */
    displayValue: string
    /** Contenu du panneau flottant (PriceTrendSnapshot ou PortfolioTrendSnapshot). */
    snapshot: ReactNode
    /** Amplitude de variance pour le sparkline. */
    variance: number
    /** Aria-label du bouton déclencheur. */
    ariaLabel?: string
}

/**
 * Bouton inline (sparkline + valeur) qui ouvre un panneau flottant via portail.
 * Composant de présentation pur — toute la logique de calcul est dans les wrappers.
 */
export function TrendHoverCard({
    sparkline,
    displayValue,
    snapshot,
    variance,
    ariaLabel = 'Afficher le détail de variation',
}: TrendHoverCardProps) {
    const [isOpen, setIsOpen] = useState(false)

    const { containerRef, triggerRef, overlayRef, position, updatePosition } = useFloatingOverlay({
        width: 360,
        height: 240,
        isOpen,
        onClose: () => setIsOpen(false),
    })

    return (
        <div ref={containerRef} className="relative inline-flex">
            <button
                ref={(el) => { triggerRef.current = el }}
                type="button"
                onClick={(event) => {
                    event.stopPropagation()
                    const nextOpen = !isOpen
                    if (nextOpen) updatePosition()
                    setIsOpen(nextOpen)
                }}
                className="px-2 py-1 rounded-lg border border-primary/25 bg-gradient-to-r from-primary/20 to-indigo-500/20 text-text hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
                aria-expanded={isOpen}
                aria-label={ariaLabel}
            >
                <span className="flex items-center gap-2">
                    <QuickTrendCurve
                        price_30_j={sparkline.p30}
                        price_7_j={sparkline.p7}
                        price_1_j={sparkline.p1}
                        price_0_j={sparkline.p0}
                        maxVariancePercent={variance}
                    />
                    <span className="tabular-nums">{displayValue}</span>
                </span>
            </button>

            {isOpen && createPortal(
                <div
                    ref={overlayRef}
                    className="fixed z-[10000] w-[min(92vw,360px)]"
                    style={{ top: `${position.top}px`, left: `${position.left}px` }}
                >
                    {snapshot}
                </div>,
                document.body,
            )}
        </div>
    )
}
