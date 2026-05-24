import type { StateCreator } from 'zustand'
import type { AppDisplayPreferencesSlice, AppStore } from '../appStoreTypes'
import type { DashboardIndicesTrendMode } from '../storage/displayPreferencesLocalStorage'
import {
    readDashboardIndicesTrendModeFromStorage,
    readDashboardTopIndicesLimitFromStorage,
    readDefaultVarianceFromStorage,
    readPortfolioVarianceFromStorage,
    writeDashboardIndicesTrendModeToStorage,
    writeDashboardTopIndicesLimitToStorage,
    writeDefaultVarianceToStorage,
    writePortfolioVarianceToStorage,
} from '../storage/displayPreferencesLocalStorage'

export const createAppDisplayPreferencesSlice: StateCreator<
    AppStore,
    [],
    [],
    AppDisplayPreferencesSlice
> = (set) => ({
    defaultVariance: readDefaultVarianceFromStorage(),
    portfolioVariance: readPortfolioVarianceFromStorage(),
    dashboardTopIndicesLimit: readDashboardTopIndicesLimitFromStorage(),
    dashboardIndicesTrendMode: readDashboardIndicesTrendModeFromStorage(),

    setDefaultVariance: (value) => {
        if (typeof value !== 'number') return
        if (!writeDefaultVarianceToStorage(value)) return
        set({ defaultVariance: value })
    },

    setPortfolioVariance: (value) => {
        if (typeof value !== 'number') return
        if (!writePortfolioVarianceToStorage(value)) return
        set({ portfolioVariance: value })
    },

    setDashboardTopIndicesLimit: (value) => {
        if (typeof value !== 'number' || !Number.isFinite(value)) return
        const limit = Math.floor(value)
        if (!writeDashboardTopIndicesLimitToStorage(limit)) return
        set({ dashboardTopIndicesLimit: limit })
    },

    setDashboardIndicesTrendMode: (mode: DashboardIndicesTrendMode) => {
        if (!writeDashboardIndicesTrendModeToStorage(mode)) return
        set({ dashboardIndicesTrendMode: mode })
    },
})
