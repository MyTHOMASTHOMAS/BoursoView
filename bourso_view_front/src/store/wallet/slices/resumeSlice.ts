import type { StateCreator } from 'zustand'
import { useCallback, useMemo } from 'react'
import { useAppStore } from '../../app-store'
import { api } from '../../../api/api'
import type { ResponseType as RT } from 'Shared/RouteType'

export interface ResumeSlice {}

export const createResumeSlice: StateCreator<ResumeSlice, [], [], ResumeSlice> = () => ({})

export type UseResumeResult = {
    resume: RT.GetResumeAction | null
    resumeLoading: boolean
    resumeError: string | null
    resumeUpdatedAt: number | undefined
    refetchResume: () => Promise<unknown>
    invalidateResumeCache: () => Promise<unknown>
}

export const useResume = (): UseResumeResult => {
    const token = useAppStore((state) => state.token)

    const body = useMemo(() => ({ authToken: token ?? '' }), [token])

    const query = api.getResume.useQuery.post(
        { body },
        { enabled: Boolean(token) },
    )

    const invalidateResumeCache = useCallback(() => {
        return api.getResume.invalidateQuery.post()
    }, [])

    return {
        resume: query.data?.success === true ? query.data.data : null,
        resumeLoading: query.isLoading || query.isFetching,
        resumeError:
            query.data?.success === false
                ? query.data.error
                : query.error instanceof Error
                    ? query.error.message
                    : null,
        resumeUpdatedAt: query.dataUpdatedAt,
        refetchResume: query.refetch,
        invalidateResumeCache,
    }
}
