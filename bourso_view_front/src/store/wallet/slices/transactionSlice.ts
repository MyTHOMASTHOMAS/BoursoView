import type { StateCreator } from 'zustand'
import { useCallback, useMemo } from 'react'
import { useAppStore } from '../../useAppStore'
import { api } from '../../../api/api'
import type { ResponseType as RT } from 'Shared/RouteType'

export interface TransactionSlice {}

export const createTransactionSlice: StateCreator<TransactionSlice, [], [], TransactionSlice> = () => ({})

type UseTransactionsOptions = {
    limit?: number
    offset?: number
}

export type UseTransactionsResult = {
    transactions: RT.TransactionItem[]
    transactionsLoading: boolean
    transactionsError: string | null
    refetchTransactions: () => Promise<unknown>
    invalidateTransactionsCache: () => Promise<unknown>
}

/**
 * Hook metier du slice transaction.
 * Toute la logique de lecture des transactions (query + etat local) est centralisee ici.
 */
export const useTransactions = (options: UseTransactionsOptions = {}): UseTransactionsResult => {
    const token = useAppStore((state) => state.token)

    // Important: query key inclut le body pour ce POST.
    // On memoise le body pour eviter une nouvelle key a chaque render.
    const body = useMemo(
        () => ({
            authToken: token ?? '',
            limit: options.limit ?? 200,
            offset: options.offset ?? 0
        }),
        [token, options.limit, options.offset]
    )

    const query = api.getTransactions.useQuery.post(
        { body },
        { enabled: Boolean(token) }
    )

    const invalidateTransactionsCache = useCallback(() => {
        return api.getTransactions.invalidateQuery.post()
    }, [])

    return {
        transactions: query.data?.success === true ? query.data.data.transactions : [],
        transactionsLoading: query.isLoading || query.isFetching,
        transactionsError:
            query.data?.success === false
                ? query.data.error
                : query.error instanceof Error
                    ? query.error.message
                    : null,
        refetchTransactions: query.refetch,
        invalidateTransactionsCache
    }
}
