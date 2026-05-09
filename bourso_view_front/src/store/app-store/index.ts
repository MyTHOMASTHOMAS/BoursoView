/**
 * Store applicatif principal (`useAppStore`).
 */
export * from './useAppStore'
export {
    APP_DISPLAY_PREFERENCES_LS_KEY,
    DEFAULT_APP_VARIANCE,
    DISPLAY_VARIANCE_MAX_INCLUSIVE,
    DISPLAY_VARIANCE_MIN_EXCLUSIVE,
    readDefaultVarianceFromStorage,
    writeDefaultVarianceToStorage,
    type AppDisplayPreferencesPersisted
} from './storage/displayPreferencesLocalStorage'
