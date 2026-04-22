import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { createPortal } from 'react-dom'

export type TableActionOption = {
    id: string
    label: string
    onSelect: () => void
    disabled?: boolean
    danger?: boolean
}

type TableActionsMenuProps = {
    options: TableActionOption[]
    buttonAriaLabel?: string
    closeOnSelect?: boolean
    onOpenChange?: (isOpen: boolean) => void
}

/**
 * Menu d'actions compact pour ligne de tableau.
 * Affiche un bouton "3 points" qui ouvre un menu contextuel.
 */
export function TableActionsMenu({
    options,
    buttonAriaLabel = 'Ouvrir les actions',
    closeOnSelect = true,
    onOpenChange
}: TableActionsMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [menuStyle, setMenuStyle] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
    const containerRef = useRef<HTMLDivElement | null>(null)
    const buttonRef = useRef<HTMLButtonElement | null>(null)
    const menuRef = useRef<HTMLDivElement | null>(null)

    const updateMenuPosition = () => {
        const button = buttonRef.current
        if (!button) return

        const rect = button.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const menuWidth = 180
        const menuHeight = Math.max(52, options.length * 40 + 16)
        const spacing = 8

        const left = Math.max(
            spacing,
            Math.min(rect.right - menuWidth, viewportWidth - menuWidth - spacing)
        )

        const openAbove = rect.bottom + spacing + menuHeight > viewportHeight - spacing
        const top = openAbove
            ? Math.max(spacing, rect.top - menuHeight - spacing)
            : rect.bottom + spacing

        setMenuStyle({ top, left })
    }

    useEffect(() => {
        onOpenChange?.(isOpen)
    }, [isOpen, onOpenChange])

    useEffect(() => {
        if (!isOpen) return

        const onDocumentClick = (event: MouseEvent) => {
            const target = event.target as Node | null
            const clickedInButtonContainer = containerRef.current?.contains(target) ?? false
            const clickedInMenu = menuRef.current?.contains(target) ?? false
            if (!clickedInButtonContainer && !clickedInMenu) {
                setIsOpen(false)
            }
        }

        const onEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', onDocumentClick)
        window.addEventListener('keydown', onEscape)
        window.addEventListener('resize', updateMenuPosition)
        window.addEventListener('scroll', updateMenuPosition, true)

        return () => {
            document.removeEventListener('mousedown', onDocumentClick)
            window.removeEventListener('keydown', onEscape)
            window.removeEventListener('resize', updateMenuPosition)
            window.removeEventListener('scroll', updateMenuPosition, true)
        }
    }, [isOpen, options.length])

    useEffect(() => {
        if (!isOpen) return
        updateMenuPosition()
    }, [isOpen, options.length])

    const toggleMenu = (event: ReactMouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        const nextOpen = !isOpen
        if (nextOpen) {
            updateMenuPosition()
        }
        setIsOpen(nextOpen)
    }

    const handleSelect = (event: ReactMouseEvent<HTMLButtonElement>, option: TableActionOption) => {
        event.stopPropagation()
        if (option.disabled) return

        option.onSelect()
        if (closeOnSelect) {
            setIsOpen(false)
        }
    }

    return (
        <div ref={containerRef} className="relative inline-flex">
            <button
                ref={buttonRef}
                type="button"
                aria-label={buttonAriaLabel}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={toggleMenu}
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-subtle bg-slate-800/95 text-primary hover:surface-hover transition-colors cursor-pointer"
            >
                <span className="sr-only">{buttonAriaLabel}</span>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                    <circle cx="12" cy="5" r="1.8" />
                    <circle cx="12" cy="12" r="1.8" />
                    <circle cx="12" cy="19" r="1.8" />
                </svg>
            </button>

            {isOpen && createPortal(
                <div
                    ref={menuRef}
                    role="menu"
                    className="fixed min-w-[180px] overflow-hidden rounded-xl border border-white/15 bg-slate-900/95 backdrop-blur-sm shadow-card z-[10000]"
                    style={{ top: `${menuStyle.top}px`, left: `${menuStyle.left}px` }}
                >
                    <div className="p-1">
                        {options.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                role="menuitem"
                                disabled={option.disabled}
                                onClick={(event) => handleSelect(event, option)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                    option.disabled
                                        ? 'opacity-50 cursor-not-allowed'
                                        : option.danger
                                            ? 'text-red-400 hover:bg-red-500/10 cursor-pointer'
                                            : 'text-primary hover:surface-hover cursor-pointer'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
