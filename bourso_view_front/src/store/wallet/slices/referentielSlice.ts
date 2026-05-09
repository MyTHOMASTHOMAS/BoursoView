import type { StateCreator } from 'zustand'
import { useCallback, useMemo } from 'react'
import { useAppStore } from '../../app-store'
import { api } from '../../../api/api'
import type { ResponseType as RT } from 'Shared/RouteType'

export interface ReferentielSlice {}

export const createReferentielSlice: StateCreator<ReferentielSlice, [], [], ReferentielSlice> = () => ({})

export type UseReferentielResult = {
    referentiels: RT.ReferentielItem[]
    referentielIds: string[]
    referentielsLoading: boolean
    referentielsError: string | null
    refetchReferentiels: () => Promise<unknown>
    invalidateReferentielsCache: () => Promise<unknown>
}

/**
 * Hook metier du slice referentiel.
 * Toute la logique referentiel (query + etat local) est centralisee ici.
 */
export const useReferentiel = (): UseReferentielResult => {
    const token = useAppStore((state) => state.token)

    // Important: query key inclut le body pour ce POST.
    // On memoise le body pour eviter une nouvelle key a chaque render.
    const body = useMemo(() => ({ authToken: token ?? '' }), [token])

    const query = api.referentiel.useQuery.post(
        { body },
        { enabled: Boolean(token) }
    )

    const invalidateReferentielsCache = useCallback(() => {
        return api.referentiel.invalidateQuery.post()
    }, [])

    const referentiels = query.data?.success === true ? query.data.data.referentiels : []
    const referentielIds = [...new Set(referentiels.map((item) => item.id).filter((id) => typeof id === 'string' && id.length > 0))]

    return {
        referentiels,
        referentielIds,
        referentielsLoading: query.isLoading || query.isFetching,
        referentielsError:
            query.data?.success === false
                ? query.data.error
                : query.error instanceof Error
                    ? query.error.message
                    : null,
        refetchReferentiels: query.refetch,
        invalidateReferentielsCache
    }
}
