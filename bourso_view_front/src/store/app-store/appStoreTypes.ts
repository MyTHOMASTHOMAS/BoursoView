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
}

export type AppStore = AppCoreSlice & AppDisplayPreferencesSlice
