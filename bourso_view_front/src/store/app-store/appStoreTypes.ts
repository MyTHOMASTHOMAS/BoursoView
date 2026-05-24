import type { DashboardIndicesTrendMode } from './storage/displayPreferencesLocalStorage'

/**
 * Types du store applicatif principal (`useAppStore`), découpés par domaine pour composition par slices.
 */

export interface AppCoreSlice {
    /** État de la connexion au backend */
    backOnline: boolean | null

    /** Validité du token utilisateur */
    userValid: boolean | null

    /** Token d’authentification courant (persisté séparément sous `boursoToken`). */
    token: string | null

    setBackOnline: (status: boolean) => void
    setUserValid: (status: boolean) => void
    setToken: (token: string) => void
}

export interface AppDisplayPreferencesSlice {
    /** Variance relative globale (sparkline, cartes tendance) ; défaut et persistance via slice dédié. */
    defaultVariance: number
    setDefaultVariance: (value: number) => void

    /** Variance pour la valorisation globale du portefeuille (carte totale, mode marché Dietz). */
    portfolioVariance: number
    setPortfolioVariance: (value: number) => void

    /** Nombre de référentiels mis en avant sur l’accueil (tri par écart de variance). */
    dashboardTopIndicesLimit: number
    setDashboardTopIndicesLimit: (value: number) => void

    /** Type de carte tendance pour les référentiels (persisté, réglable depuis l’accueil uniquement). */
    dashboardIndicesTrendMode: DashboardIndicesTrendMode
    setDashboardIndicesTrendMode: (mode: DashboardIndicesTrendMode) => void
}

export type AppStore = AppCoreSlice & AppDisplayPreferencesSlice
