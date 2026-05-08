import { useCallback, useState } from 'react'
import { useAppStore, useReferentiel } from '../../store'
import type { ResponseType as RT } from 'Shared/RouteType'

export function useIndicesPage() {
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false)
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
    const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false)
    const [selectedReferentiel, setSelectedReferentiel] = useState<RT.ReferentielItem | null>(null)
    const [selectedDetailsReferentiel, setSelectedDetailsReferentiel] = useState<RT.ReferentielItem | null>(null)
    const token = useAppStore((state) => state.token)

    const {
        referentiels,
        referentielsLoading,
        referentielsError,
        refetchReferentiels,
        invalidateReferentielsCache
    } = useReferentiel()

    const openCreatePopup = useCallback(() => {
        setIsCreatePopupOpen(true)
    }, [])

    const closeCreatePopup = useCallback(() => {
        setIsCreatePopupOpen(false)
    }, [])

    const openDeletePopup = useCallback((referentiel: RT.ReferentielItem) => {
        setSelectedReferentiel(referentiel)
        setIsDeletePopupOpen(true)
    }, [])

    const closeDeletePopup = useCallback(() => {
        setIsDeletePopupOpen(false)
        setSelectedReferentiel(null)
    }, [])

    const openDetailsPopup = useCallback((referentiel: RT.ReferentielItem) => {
        setSelectedDetailsReferentiel(referentiel)
        setIsDetailsPopupOpen(true)
    }, [])

    const closeDetailsPopup = useCallback(() => {
        setIsDetailsPopupOpen(false)
        setSelectedDetailsReferentiel(null)
    }, [])

    const refreshReferentiels = useCallback(() => {
        void refetchReferentiels()
    }, [refetchReferentiels])

    const handleCreateAction = useCallback((action: string) => {
        if (action !== 'created') return
        void invalidateReferentielsCache().then(() => refetchReferentiels())
    }, [invalidateReferentielsCache, refetchReferentiels])

    const handleDeleteAction = useCallback((action: string) => {
        if (action !== 'deleted') return
        void invalidateReferentielsCache().then(() => refetchReferentiels())
        closeDeletePopup()
    }, [closeDeletePopup, invalidateReferentielsCache, refetchReferentiels])

    return {
        token,
        referentiels,
        referentielsLoading,
        referentielsError,
        isCreatePopupOpen,
        isDeletePopupOpen,
        isDetailsPopupOpen,
        selectedReferentiel,
        selectedDetailsReferentiel,
        openCreatePopup,
        closeCreatePopup,
        openDeletePopup,
        closeDeletePopup,
        openDetailsPopup,
        closeDetailsPopup,
        refreshReferentiels,
        handleCreateAction,
        handleDeleteAction
    }
}
