import type { StateCreator } from 'zustand'
import type { AppDisplayPreferencesSlice, AppStore } from '../appStoreTypes'
import { readDefaultVarianceFromStorage, writeDefaultVarianceToStorage } from '../storage/displayPreferencesLocalStorage'

export const createAppDisplayPreferencesSlice: StateCreator<
    AppStore,
    [],
    [],
    AppDisplayPreferencesSlice
> = (set) => ({
    defaultVariance: readDefaultVarianceFromStorage(),

    setDefaultVariance: (value) => {
        if (typeof value !== 'number') return
        if (!writeDefaultVarianceToStorage(value)) return
        set({ defaultVariance: value })
    }
})
