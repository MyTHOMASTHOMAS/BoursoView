import { create } from 'zustand'
import { createReferentielSlice, type ReferentielSlice } from './slices/referentielSlice'
import { createTransactionSlice, type TransactionSlice } from './slices/transactionSlice'
import { createFinanceHistorySlice, type FinanceHistorySlice } from './slices/financeHistorySlice'

export type WalletStore = ReferentielSlice & TransactionSlice & FinanceHistorySlice

export const useWalletStore = create<WalletStore>()((...args) => ({
    ...createReferentielSlice(...args),
    ...createTransactionSlice(...args),
    ...createFinanceHistorySlice(...args),
}))

