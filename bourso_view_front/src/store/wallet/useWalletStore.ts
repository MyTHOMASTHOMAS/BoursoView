import { create } from 'zustand'
import { createReferentielSlice, type ReferentielSlice } from './slices/referentielSlice'
import { createTransactionSlice, type TransactionSlice } from './slices/transactionSlice'
import { createFinanceHistorySlice, type FinanceHistorySlice } from './slices/financeHistorySlice'
import { createFundSlice, type FundSlice } from './slices/fundSlice'

export type WalletStore = ReferentielSlice & TransactionSlice & FinanceHistorySlice & FundSlice

export const useWalletStore = create<WalletStore>()((...args) => ({
    ...createReferentielSlice(...args),
    ...createTransactionSlice(...args),
    ...createFinanceHistorySlice(...args),
    ...createFundSlice(...args),
}))

