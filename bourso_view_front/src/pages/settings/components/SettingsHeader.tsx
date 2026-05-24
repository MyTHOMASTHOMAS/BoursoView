type SettingsHeaderProps = {
    title?: string
    subtitle?: string
}

export function SettingsHeader({
    title = 'Paramètres',
    subtitle = 'Configuration de votre application.',
}: SettingsHeaderProps) {
    return (
        <header>
            <h1 className="text-heading-xl text-primary">{title}</h1>
            <p className="mt-1 text-muted">{subtitle}</p>
        </header>
    )
}
