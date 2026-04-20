import { create } from 'zustand'
import { createReferentielSlice, type ReferentielSlice } from './slices/referentielSlice'
import { createAchatSlice, type AchatSlice } from './slices/achatSlice'

export type WalletStore = ReferentielSlice & AchatSlice

export const useWalletStore = create<WalletStore>()((...args) => ({
    ...createReferentielSlice(...args),
    ...createAchatSlice(...args)
}))
