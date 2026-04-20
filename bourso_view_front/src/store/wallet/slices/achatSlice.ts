import type { StateCreator } from 'zustand'
import { useMemo } from 'react'
import { useAppStore } from '../../useAppStore'
import { api } from '../../../api/api'
import type { ResponseType as RT } from 'Shared/RouteType'

export interface AchatSlice {}

export const createAchatSlice: StateCreator<AchatSlice, [], [], AchatSlice> = () => ({})

export type UseAchatsResult = {
    achats: RT.AchatItem[]
    achatsLoading: boolean
    achatsError: string | null
    refetchAchats: () => Promise<unknown>
}

/**
 * Hook metier du slice achat.
 * Toute la logique de lecture des achats (query + etat local) est centralisee ici.
 */
export const useAchats = (): UseAchatsResult => {
    const token = useAppStore((state) => state.token)

    // Important: query key inclut le body pour ce POST.
    // On memoise le body pour eviter une nouvelle key a chaque render.
    const body = useMemo(
        () => ({ authToken: token ?? '', limit: 200, offset: 0 }),
        [token]
    )

    const query = api.getAchats.useQuery.post(
        { body },
        { enabled: Boolean(token) }
    )

    return {
        achats: query.data?.success === true ? query.data.data.achats : [],
        achatsLoading: query.isLoading || query.isFetching,
        achatsError:
            query.data?.success === false
                ? query.data.error
                : query.error instanceof Error
                    ? query.error.message
                    : null,
        refetchAchats: query.refetch
    }
}
