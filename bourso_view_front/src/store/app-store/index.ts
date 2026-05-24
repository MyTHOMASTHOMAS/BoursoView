/**
 * Store applicatif principal (`useAppStore`).
 */
export * from './useAppStore'
export {
    APP_DISPLAY_PREFERENCES_LS_KEY,
    DEFAULT_APP_VARIANCE,
    DEFAULT_DASHBOARD_TOP_INDICES_LIMIT,
    DASHBOARD_TOP_INDICES_MAX,
    DASHBOARD_TOP_INDICES_MIN,
    DISPLAY_VARIANCE_MAX_INCLUSIVE,
    DISPLAY_VARIANCE_MIN_EXCLUSIVE,
    readDashboardTopIndicesLimitFromStorage,
    readDefaultVarianceFromStorage,
    readPortfolioVarianceFromStorage,
    writeDashboardTopIndicesLimitToStorage,
    writeDashboardIndicesTrendModeToStorage,
    writeDefaultVarianceToStorage,
    writePortfolioVarianceToStorage,
    type AppDisplayPreferencesPersisted,
    type DashboardIndicesTrendMode,
    DEFAULT_DASHBOARD_INDICES_TREND_MODE,
} from './storage/displayPreferencesLocalStorage'
