import {
    DEFAULT_APP_VARIANCE,
    DEFAULT_DASHBOARD_TOP_INDICES_LIMIT,
    DASHBOARD_TOP_INDICES_MAX,
    DASHBOARD_TOP_INDICES_MIN,
    DISPLAY_VARIANCE_MAX_INCLUSIVE,
    DISPLAY_VARIANCE_MIN_EXCLUSIVE,
} from '../../../store/app-store'
import type { SettingsPageViewProps } from '../useSettingsPage'
import { SettingsFieldGroup } from './SettingsFieldGroup'
import { SettingsMetaLine } from './SettingsMetaLine'
import { SettingsNumberInput } from './SettingsNumberInput'
import { SettingsSectionCard } from './SettingsSectionCard'

type DisplayPreferencesSectionProps = Pick<
    SettingsPageViewProps,
    'dashboardTopIndicesLimit' | 'varianceHint' | 'varianceField' | 'topIndicesField'
>

export function DisplayPreferencesSection({
    dashboardTopIndicesLimit,
    varianceHint,
    varianceField,
    topIndicesField,
}: DisplayPreferencesSectionProps) {
    return (
        <SettingsSectionCard
            title="Affichage des cours"
            intro={
                <p>
                    Réglages partagés par les mini-graphiques, les cartes de variation et le
                    bandeau de référentiels sur l&apos;accueil.
                </p>
            }
        >
            <SettingsFieldGroup
                label="Variance par défaut"
                htmlFor="app-variance"
                description={
                    <>
                        <p>
                            Définit l&apos;échelle des mouvements de prix affichés dans les
                            tendances (couleur et intensité du gradient).
                        </p>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>
                                <strong>Exemple</strong> :{' '}
                                <strong>0,2</strong> correspond à environ{' '}
                                <strong>±20&nbsp;%</strong> par rapport au prix de référence du
                                segment.
                            </li>
                            <li>
                                <strong>Valeur élevée</strong> : il faut un mouvement plus fort
                                pour atteindre les couleurs « saturées » (extrême hausse ou baisse).
                            </li>
                            <li>
                                <strong>Valeur basse</strong> : les petites variations ressortent
                                davantage.
                            </li>
                        </ul>
                        <SettingsMetaLine>
                            Plage acceptée : strictement au-dessus de{' '}
                            {DISPLAY_VARIANCE_MIN_EXCLUSIVE} jusqu&apos;à{' '}
                            {DISPLAY_VARIANCE_MAX_INCLUSIVE} · Suggéré :{' '}
                            <strong>{DEFAULT_APP_VARIANCE}</strong> · Enregistré sur cet appareil.
                        </SettingsMetaLine>
                    </>
                }
                control={
                    <>
                        <SettingsNumberInput
                            id="app-variance"
                            value={varianceField.input}
                            onChange={varianceField.setInput}
                            onCommit={varianceField.commit}
                            inputMode="decimal"
                            step={0.05}
                            min={DISPLAY_VARIANCE_MIN_EXCLUSIVE + 1e-6}
                            max={DISPLAY_VARIANCE_MAX_INCLUSIVE}
                            describedBy="app-variance-hint"
                        />
                        <span
                            id="app-variance-hint"
                            className="text-muted text-sm tabular-nums"
                        >
                            {varianceHint}
                        </span>
                    </>
                }
            />

            <SettingsFieldGroup
                label="Référentiels sur l&apos;accueil"
                htmlFor="dashboard-top-indices"
                borderedTop
                description={
                    <>
                        <p>
                            Nombre de référentiels mis en avant sur la page d&apos;accueil.
                        </p>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>
                                Sélection parmi ceux dont l&apos;écart de variation est le plus
                                marqué (horizons 1&nbsp;jour, 7&nbsp;jours et 1&nbsp;mois).
                            </li>
                            <li>
                                Les lignes les plus utiles à surveiller en priorité apparaissent en
                                premier.
                            </li>
                        </ul>
                        <SettingsMetaLine>
                            Plage : {DASHBOARD_TOP_INDICES_MIN} à {DASHBOARD_TOP_INDICES_MAX} ·
                            Suggéré : <strong>{DEFAULT_DASHBOARD_TOP_INDICES_LIMIT}</strong> ·
                            Enregistré sur cet appareil.
                        </SettingsMetaLine>
                    </>
                }
                control={
                    <>
                        <SettingsNumberInput
                            id="dashboard-top-indices"
                            value={topIndicesField.input}
                            onChange={topIndicesField.setInput}
                            onCommit={topIndicesField.commit}
                            inputMode="numeric"
                            step={1}
                            min={DASHBOARD_TOP_INDICES_MIN}
                            max={DASHBOARD_TOP_INDICES_MAX}
                        />
                        <span className="text-muted text-sm tabular-nums">
                            Valeur active : <strong>{dashboardTopIndicesLimit}</strong>
                        </span>
                    </>
                }
            />
        </SettingsSectionCard>
    )
}
