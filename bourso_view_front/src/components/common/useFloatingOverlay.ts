import { useCallback, useEffect, useRef, useState } from 'react'

type UseFloatingOverlayOptions = {
    width: number
    height: number
    spacing?: number
    isOpen: boolean
    onClose: () => void
    deps?: unknown[]
}

type FloatingPosition = {
    top: number
    left: number
}

export function useFloatingOverlay({
    width,
    height,
    spacing = 8,
    isOpen,
    onClose,
    deps = []
}: UseFloatingOverlayOptions) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const triggerRef = useRef<HTMLElement | null>(null)
    const overlayRef = useRef<HTMLDivElement | null>(null)
    const [position, setPosition] = useState<FloatingPosition>({ top: 0, left: 0 })

    const updatePosition = useCallback(() => {
        const trigger = triggerRef.current
        if (!trigger) return

        const rect = trigger.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        const left = Math.max(
            spacing,
            Math.min(rect.right - width, viewportWidth - width - spacing)
        )

        const openAbove = rect.bottom + spacing + height > viewportHeight - spacing
        const top = openAbove
            ? Math.max(spacing, rect.top - height - spacing)
            : rect.bottom + spacing

        setPosition({ top, left })
    }, [height, spacing, width])

    useEffect(() => {
        if (!isOpen) return

        const onDocumentClick = (event: MouseEvent) => {
            const target = event.target as Node | null
            const clickedInTriggerContainer = containerRef.current?.contains(target) ?? false
            const clickedInOverlay = overlayRef.current?.contains(target) ?? false

            if (!clickedInTriggerContainer && !clickedInOverlay) {
                onClose()
            }
        }

        const onEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('mousedown', onDocumentClick)
        window.addEventListener('keydown', onEscape)
        window.addEventListener('resize', updatePosition)
        window.addEventListener('scroll', updatePosition, true)

        return () => {
            document.removeEventListener('mousedown', onDocumentClick)
            window.removeEventListener('keydown', onEscape)
            window.removeEventListener('resize', updatePosition)
            window.removeEventListener('scroll', updatePosition, true)
        }
    }, [isOpen, onClose, updatePosition, ...deps])

    useEffect(() => {
        if (!isOpen) return
        updatePosition()
    }, [isOpen, updatePosition, ...deps])

    return {
        containerRef,
        triggerRef,
        overlayRef,
        position,
        updatePosition
    }
}
