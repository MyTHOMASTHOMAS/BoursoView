/**
 * Persistance des préférences d’affichage liées au sparkline / snapshot (localStorage).
 */

/** Clé localStorage pour les préférences d’affichage globales (JSON). */
export const APP_DISPLAY_PREFERENCES_LS_KEY = 'boursoView.app.displayPreferences'

/** Variance relative par défaut si aucune valeur persistée ou donnée invalide. */
export const DEFAULT_APP_VARIANCE = 0.2

export const DISPLAY_VARIANCE_MIN_EXCLUSIVE = 0
export const DISPLAY_VARIANCE_MAX_INCLUSIVE = 2

export type AppDisplayPreferencesPersisted = {
    defaultVariance?: number
}

function isVarianceInPersistedRange(value: number): boolean {
    return (
        Number.isFinite(value) &&
        value > DISPLAY_VARIANCE_MIN_EXCLUSIVE &&
        value <= DISPLAY_VARIANCE_MAX_INCLUSIVE
    )
}

function parseStoredVariance(raw: string | null): number | null {
    if (raw == null || raw === '') return null
    try {
        const parsed = JSON.parse(raw) as unknown
        if (typeof parsed !== 'object' || parsed === null) return null
        const v = (parsed as AppDisplayPreferencesPersisted).defaultVariance
        if (typeof v !== 'number' || !isVarianceInPersistedRange(v)) return null
        return v
    } catch {
        return null
    }
}

/**
 * Lit la variance persistée ou retourne {@link DEFAULT_APP_VARIANCE}.
 */
export function readDefaultVarianceFromStorage(): number {
    const v = parseStoredVariance(localStorage.getItem(APP_DISPLAY_PREFERENCES_LS_KEY))
    return v ?? DEFAULT_APP_VARIANCE
}

/**
 * Enregistre la variance dans le JSON sous {@link APP_DISPLAY_PREFERENCES_LS_KEY}.
 * @returns `false` si la valeur est hors plage ou si l’écriture a échoué.
 */
export function writeDefaultVarianceToStorage(defaultVariance: number): boolean {
    if (!isVarianceInPersistedRange(defaultVariance)) return false
    try {
        let prev: AppDisplayPreferencesPersisted = {}
        const raw = localStorage.getItem(APP_DISPLAY_PREFERENCES_LS_KEY)
        if (raw) {
            const parsed = JSON.parse(raw) as unknown
            if (typeof parsed === 'object' && parsed !== null) {
                prev = parsed as AppDisplayPreferencesPersisted
            }
        }
        localStorage.setItem(
            APP_DISPLAY_PREFERENCES_LS_KEY,
            JSON.stringify({ ...prev, defaultVariance })
        )
        return true
    } catch {
        return false
    }
}
