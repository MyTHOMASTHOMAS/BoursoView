/**
 * Persistance des préférences d’affichage (localStorage).
 */

/** Clé localStorage pour les préférences d’affichage globales (JSON). */
export const APP_DISPLAY_PREFERENCES_LS_KEY = 'boursoView.app.displayPreferences'

/** Variance relative par défaut si aucune valeur persistée ou donnée invalide. */
export const DEFAULT_APP_VARIANCE = 0.2

export const DISPLAY_VARIANCE_MIN_EXCLUSIVE = 0
export const DISPLAY_VARIANCE_MAX_INCLUSIVE = 2

/** Nombre de référentiels mis en avant sur l’accueil (tri par écart de variance). */
export const DEFAULT_DASHBOARD_TOP_INDICES_LIMIT = 5

export const DASHBOARD_TOP_INDICES_MIN = 1
export const DASHBOARD_TOP_INDICES_MAX = 20

/** Mode d'affichage des tendances référentiels sur l'accueil (hors onglet Paramètres). */
export type DashboardIndicesTrendMode = 'price' | 'portfolio'

export const DEFAULT_DASHBOARD_INDICES_TREND_MODE: DashboardIndicesTrendMode = 'price'

const DASHBOARD_INDICES_TREND_MODES: DashboardIndicesTrendMode[] = ['price', 'portfolio']

export type AppDisplayPreferencesPersisted = {
    defaultVariance?: number
    /** Variance pour la valorisation globale du portefeuille (Dietz, carte totale). */
    portfolioVariance?: number
    dashboardTopIndicesLimit?: number
    dashboardIndicesTrendMode?: DashboardIndicesTrendMode
}

function isDashboardIndicesTrendMode(value: unknown): value is DashboardIndicesTrendMode {
    return typeof value === 'string' && DASHBOARD_INDICES_TREND_MODES.includes(value as DashboardIndicesTrendMode)
}

function isVarianceInPersistedRange(value: number): boolean {
    return (
        Number.isFinite(value) &&
        value > DISPLAY_VARIANCE_MIN_EXCLUSIVE &&
        value <= DISPLAY_VARIANCE_MAX_INCLUSIVE
    )
}

function isDashboardTopIndicesLimitInRange(value: number): boolean {
    return (
        Number.isInteger(value) &&
        value >= DASHBOARD_TOP_INDICES_MIN &&
        value <= DASHBOARD_TOP_INDICES_MAX
    )
}

function readPersistedPreferences(): AppDisplayPreferencesPersisted {
    const raw = localStorage.getItem(APP_DISPLAY_PREFERENCES_LS_KEY)
    if (raw == null || raw === '') return {}
    try {
        const parsed = JSON.parse(raw) as unknown
        if (typeof parsed !== 'object' || parsed === null) return {}
        return parsed as AppDisplayPreferencesPersisted
    } catch {
        return {}
    }
}

function writePersistedPreferences(next: AppDisplayPreferencesPersisted): boolean {
    try {
        localStorage.setItem(APP_DISPLAY_PREFERENCES_LS_KEY, JSON.stringify(next))
        return true
    } catch {
        return false
    }
}

/**
 * Fusionne un patch dans les préférences persistées (validation par champ).
 */
export function writeDisplayPreferencesPatch(
    patch: Partial<AppDisplayPreferencesPersisted>,
): boolean {
    const prev = readPersistedPreferences()
    const next: AppDisplayPreferencesPersisted = { ...prev }

    if (patch.defaultVariance !== undefined) {
        if (!isVarianceInPersistedRange(patch.defaultVariance)) return false
        next.defaultVariance = patch.defaultVariance
    }

    if (patch.portfolioVariance !== undefined) {
        if (!isVarianceInPersistedRange(patch.portfolioVariance)) return false
        next.portfolioVariance = patch.portfolioVariance
    }

    if (patch.dashboardTopIndicesLimit !== undefined) {
        const limit = Math.floor(patch.dashboardTopIndicesLimit)
        if (!isDashboardTopIndicesLimitInRange(limit)) return false
        next.dashboardTopIndicesLimit = limit
    }

    if (patch.dashboardIndicesTrendMode !== undefined) {
        if (!isDashboardIndicesTrendMode(patch.dashboardIndicesTrendMode)) return false
        next.dashboardIndicesTrendMode = patch.dashboardIndicesTrendMode
    }

    return writePersistedPreferences(next)
}

/**
 * Lit la variance persistée ou retourne {@link DEFAULT_APP_VARIANCE}.
 */
export function readDefaultVarianceFromStorage(): number {
    const v = readPersistedPreferences().defaultVariance
    if (v != null && isVarianceInPersistedRange(v)) return v
    return DEFAULT_APP_VARIANCE
}

/**
 * Lit la limite d’indices accueil persistée ou {@link DEFAULT_DASHBOARD_TOP_INDICES_LIMIT}.
 */
export function readDashboardTopIndicesLimitFromStorage(): number {
    const v = readPersistedPreferences().dashboardTopIndicesLimit
    if (v != null && isDashboardTopIndicesLimitInRange(v)) return v
    return DEFAULT_DASHBOARD_TOP_INDICES_LIMIT
}

/**
 * Enregistre la variance dans le JSON sous {@link APP_DISPLAY_PREFERENCES_LS_KEY}.
 * @returns `false` si la valeur est hors plage ou si l’écriture a échoué.
 */
export function writeDefaultVarianceToStorage(defaultVariance: number): boolean {
    return writeDisplayPreferencesPatch({ defaultVariance })
}

/**
 * Lit la variance portefeuille global ou retombe sur {@link readDefaultVarianceFromStorage}.
 */
export function readPortfolioVarianceFromStorage(): number {
    const v = readPersistedPreferences().portfolioVariance
    if (v != null && isVarianceInPersistedRange(v)) return v
    return readDefaultVarianceFromStorage()
}

export function writePortfolioVarianceToStorage(portfolioVariance: number): boolean {
    return writeDisplayPreferencesPatch({ portfolioVariance })
}

/**
 * Enregistre le nombre de référentiels affichés sur l’accueil.
 */
export function writeDashboardTopIndicesLimitToStorage(dashboardTopIndicesLimit: number): boolean {
    return writeDisplayPreferencesPatch({ dashboardTopIndicesLimit })
}

export function readDashboardIndicesTrendModeFromStorage(): DashboardIndicesTrendMode {
    const mode = readPersistedPreferences().dashboardIndicesTrendMode
    if (isDashboardIndicesTrendMode(mode)) return mode
    return DEFAULT_DASHBOARD_INDICES_TREND_MODE
}

export function writeDashboardIndicesTrendModeToStorage(
    dashboardIndicesTrendMode: DashboardIndicesTrendMode,
): boolean {
    return writeDisplayPreferencesPatch({ dashboardIndicesTrendMode })
}
