import type { StateCreator } from 'zustand'
import type { AppDisplayPreferencesSlice, AppStore } from '../appStoreTypes'
import {
    readDashboardTopIndicesLimitFromStorage,
    readDefaultVarianceFromStorage,
    writeDashboardTopIndicesLimitToStorage,
    writeDefaultVarianceToStorage,
} from '../storage/displayPreferencesLocalStorage'

export const createAppDisplayPreferencesSlice: StateCreator<
    AppStore,
    [],
    [],
    AppDisplayPreferencesSlice
> = (set) => ({
    defaultVariance: readDefaultVarianceFromStorage(),
    dashboardTopIndicesLimit: readDashboardTopIndicesLimitFromStorage(),

    setDefaultVariance: (value) => {
        if (typeof value !== 'number') return
        if (!writeDefaultVarianceToStorage(value)) return
        set({ defaultVariance: value })
    },

    setDashboardTopIndicesLimit: (value) => {
        if (typeof value !== 'number' || !Number.isFinite(value)) return
        const limit = Math.floor(value)
        if (!writeDashboardTopIndicesLimitToStorage(limit)) return
        set({ dashboardTopIndicesLimit: limit })
    },
})
