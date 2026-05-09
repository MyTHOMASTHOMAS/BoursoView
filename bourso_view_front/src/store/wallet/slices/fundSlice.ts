import type { StateCreator } from 'zustand'
import { useCallback, useMemo } from 'react'
import { useAppStore } from '../../app-store'
import { api } from '../../../api/api'
import type { ResponseType as RT } from 'Shared/RouteType'

export interface FundSlice {}

export const createFundSlice: StateCreator<FundSlice, [], [], FundSlice> = () => ({})

type UseFundsOptions = {
    limit?: number
    offset?: number
}

export type UseFundsResult = {
    funds: RT.FundItem[]
    fundsLoading: boolean
    fundsError: string | null
    refetchFunds: () => Promise<unknown>
    invalidateFundsCache: () => Promise<unknown>
}

export const useFunds = (options: UseFundsOptions = {}): UseFundsResult => {
    const token = useAppStore((state) => state.token)

    const body = useMemo(
        () => ({
            authToken: token ?? '',
            limit: options.limit ?? 200,
            offset: options.offset ?? 0
        }),
        [token, options.limit, options.offset]
    )

    const query = api.getFunds.useQuery.post(
        { body },
        { enabled: Boolean(token) }
    )

    const invalidateFundsCache = useCallback(() => {
        return api.getFunds.invalidateQuery.post()
    }, [])

    return {
        funds: query.data?.success === true ? query.data.data.funds : [],
        fundsLoading: query.isLoading || query.isFetching,
        fundsError:
            query.data?.success === false
                ? query.data.error
                : query.error instanceof Error
                    ? query.error.message
                    : null,
        refetchFunds: query.refetch,
        invalidateFundsCache
    }
}
