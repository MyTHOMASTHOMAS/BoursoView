import { create } from 'zustand'
import { createReferentielSlice, type ReferentielSlice } from './slices/referentielSlice'

export type WalletStore = ReferentielSlice

export const useWalletStore = create<WalletStore>()((...args) => ({
    ...createReferentielSlice(...args)
}))
