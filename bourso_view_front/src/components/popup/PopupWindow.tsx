import { useEffect, type MouseEvent } from 'react'
import type { AbstractPopupContent, PopupContentBaseProps } from './AbstractPopupContent'

type PopupWindowProps<TContentProps extends PopupContentBaseProps> = {
    isOpen: boolean
    title?: string
    onClose: () => void
    onAction?: (action: string, payload?: unknown) => void
    closeOnBackdropClick?: boolean
    ContentComponent: new (props: TContentProps) => AbstractPopupContent<TContentProps, unknown>
    contentProps?: Omit<TContentProps, keyof PopupContentBaseProps>
}

/**
 * Composant principal de popup.
 * Affiche un contenu concret qui hérite d'AbstractPopupContent.
 */
export function PopupWindow<TContentProps extends PopupContentBaseProps>({
    isOpen,
    title,
    onClose,
    onAction,
    closeOnBackdropClick = true,
    ContentComponent,
    contentProps
}: PopupWindowProps<TContentProps>) {
    useEffect(() => {
        if (!isOpen) return

        const onEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        window.addEventListener('keydown', onEscape)
        return () => window.removeEventListener('keydown', onEscape)
    }, [isOpen, onClose])

    if (!isOpen) return null

    const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
        if (!closeOnBackdropClick) return
        if (event.target === event.currentTarget) {
            onClose()
        }
    }

    const mergedProps = {
        ...(contentProps ?? {}),
        onClose,
        onAction
    } as TContentProps

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-label={title ?? 'Popup'}
        >
            <div className="w-full max-w-2xl rounded-2xl surface-light border border-subtle shadow-card">
                <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-subtle">
                    <h2 className="text-heading-lg text-primary">{title ?? 'Popup'}</h2>
                    <button
                        onClick={onClose}
                        className="btn-padding radius-btn border border-subtle text-primary hover:surface-hover transition-colors cursor-pointer"
                        aria-label="Fermer la popup"
                    >
                        Fermer
                    </button>
                </div>

                <div className="p-5">
                    <ContentComponent {...mergedProps} />
                </div>
            </div>
        </div>
    )
}
