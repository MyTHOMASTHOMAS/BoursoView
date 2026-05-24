import type { ReactNode } from 'react'

type SettingsFieldGroupProps = {
    label: string
    htmlFor: string
    description: ReactNode
    control: ReactNode
    hint?: ReactNode
    borderedTop?: boolean
}

export function SettingsFieldGroup({
    label,
    htmlFor,
    description,
    control,
    hint,
    borderedTop = false,
}: SettingsFieldGroupProps) {
    return (
        <div
            className={
                borderedTop
                    ? 'space-y-3 pt-8 border-t border-subtle'
                    : 'space-y-3'
            }
        >
            <label htmlFor={htmlFor} className="block text-sm font-medium text-text">
                {label}
            </label>
            <div className="text-muted text-sm leading-relaxed space-y-3">{description}</div>
            <div className="flex flex-wrap items-center gap-3">{control}</div>
            {hint != null && <div className="text-muted text-sm">{hint}</div>}
        </div>
    )
}
