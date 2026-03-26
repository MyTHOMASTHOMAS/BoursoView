import type { StateCreator } from 'zustand'
import { useMemo } from 'react'
import { useAppStore } from '../../useAppStore'
import { api } from '../../../api/api'
import type { ResponseType as RT } from 'Shared/RouteType'

export interface ReferentielSlice {}

export const createReferentielSlice: StateCreator<ReferentielSlice, [], [], ReferentielSlice> = () => ({})

export type UseReferentielResult = {
    referentiels: RT.ReferentielItem[]
    referentielsLoading: boolean
    referentielsError: string | null
    refetchReferentiels: () => Promise<unknown>
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

    return {
        referentiels: query.data?.success === true ? query.data.data.referentiels : [],
        referentielsLoading: query.isLoading || query.isFetching,
        referentielsError:
            query.data?.success === false
                ? query.data.error
                : query.error instanceof Error
                    ? query.error.message
                    : null,
        refetchReferentiels: query.refetch
    }
}
