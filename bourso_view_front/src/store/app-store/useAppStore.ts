/**
 * @file useAppStore.ts
 * @description Store Zustand singleton : cœur app (backend, auth) + préférences d’affichage (slice variance, localStorage).
 *
 * Le token reste sous la clé `boursoToken`. Les autres préférences globales passent par
 * la clé `boursoView.app.displayPreferences` (voir `appDisplayPreferencesSlice`).
 */
import { create } from 'zustand'
import type { StateCreator } from 'zustand'
import type { AppCoreSlice, AppStore } from './appStoreTypes'
import { createAppDisplayPreferencesSlice } from './slices/appDisplayPreferencesSlice'

const createAppCoreSlice: StateCreator<AppStore, [], [], AppCoreSlice> = (set) => ({
    backOnline: null,
    userValid: null,
    token: localStorage.getItem('boursoToken'),

    setBackOnline: (status) => set({ backOnline: status }),
    setUserValid: (status) => set({ userValid: status }),

    setToken: (token) => {
        localStorage.setItem('boursoToken', token)
        set({ token, userValid: null })
    }
})

export const useAppStore = create<AppStore>()((...args) => ({
    ...createAppCoreSlice(...args),
    ...createAppDisplayPreferencesSlice(...args)
}))

export type { AppCoreSlice, AppDisplayPreferencesSlice, AppStore } from './appStoreTypes'
