import type { ReactNode } from 'react'

type SettingsMetaLineProps = {
    children: ReactNode
}

/** Ligne compacte : plage, valeur suggérée, persistance locale. */
export function SettingsMetaLine({ children }: SettingsMetaLineProps) {
    return (
        <p className="text-xs text-muted/90 border-l-2 border-subtle pl-3 not-italic">
            {children}
        </p>
    )
}
