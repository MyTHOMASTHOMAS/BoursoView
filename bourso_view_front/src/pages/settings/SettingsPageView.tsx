import { DisplayPreferencesSection } from './components/DisplayPreferencesSection'
import { SettingsComingSoonCard } from './components/SettingsComingSoonCard'
import { SettingsHeader } from './components/SettingsHeader'
import type { SettingsPageViewProps } from './useSettingsPage'

export function SettingsPageView(props: SettingsPageViewProps) {
    return (
        <div className="space-y-6">
            <SettingsHeader />
            <DisplayPreferencesSection {...props} />
            <SettingsComingSoonCard />
        </div>
    )
}
