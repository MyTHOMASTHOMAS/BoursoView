/**
 * @file useAppStore.ts
 * @description Store Zustand pour l'état d'initialisation de l'application BoursoView.
 * 
 * Gère la disponibilité du backend (`backOnline`) et la validité de
 * l'authentification de l'utilisateur (`userValid`).
 * 
 * Utilise l'instance singleton de `ApiClient` pour effectuer les requêtes réseau
 * en dehors du cycle de vie des composants React.
 */
import { create } from 'zustand'

interface AppState {
    /** État de la connexion au backend */
    backOnline: boolean | null

    /** Validité du token utilisateur */
    userValid: boolean | null

    /** Le token d'authentification actuel */
    token: string | null

    /** Mettre à jour l'état de la connexion au backend. */
    setBackOnline: (status: boolean) => void

    /** Mettre à jour la validité de l'utilisateur. */
    setUserValid: (status: boolean) => void

    /** Met à jour le token en mémoire et dans le localStorage */
    setToken: (token: string) => void
}

// ─── Définition du Store ─────────────────────────────────────────────────────

export const useAppStore = create<AppState>((set) => ({
    backOnline: null,
    userValid: null,
    token: localStorage.getItem('boursoToken'),

    setBackOnline: (status) => set({ backOnline: status }),
    setUserValid: (status) => set({ userValid: status }),

    setToken: (token) => {
        localStorage.setItem('boursoToken', token)
        set({ token, userValid: null }) // Réinitialise la validité quand le token change
    }
}))
