import { SettingsPageView } from './SettingsPageView'
import { useSettingsPage } from './useSettingsPage'

export default function Settings() {
    const settingsPage = useSettingsPage()
    return <SettingsPageView {...settingsPage} />
}
