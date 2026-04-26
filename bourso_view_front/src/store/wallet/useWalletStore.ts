import { create } from 'zustand'
import { createReferentielSlice, type ReferentielSlice } from './slices/referentielSlice'
import { createTransactionSlice, type TransactionSlice } from './slices/transactionSlice'

export type WalletStore = ReferentielSlice & TransactionSlice

export const useWalletStore = create<WalletStore>()((...args) => ({
    ...createReferentielSlice(...args),
    ...createTransactionSlice(...args),
}))

