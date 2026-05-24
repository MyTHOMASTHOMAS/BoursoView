import type { ReactNode } from 'react'

type SettingsSectionCardProps = {
    title: string
    intro: ReactNode
    children: ReactNode
}

export function SettingsSectionCard({ title, intro, children }: SettingsSectionCardProps) {
    return (
        <section className="glass-card radius-card card-large-padding text-left max-w-2xl">
            <h2 className="text-heading-lg text-text mb-2">{title}</h2>
            <div className="text-muted text-sm mb-6 space-y-2">{intro}</div>
            <div className="space-y-8">{children}</div>
        </section>
    )
}
