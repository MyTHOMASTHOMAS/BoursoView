import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAppStore, useReferentiel } from '../../store'
import type { ResponseType as RT } from 'Shared/RouteType'

export function useIndicesPage() {
    const [page, setPage] = useState(1)
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false)
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
    const [selectedReferentiel, setSelectedReferentiel] = useState<RT.ReferentielItem | null>(null)
    const pageSize = 5
    const token = useAppStore((state) => state.token)

    const {
        referentiels,
        referentielsLoading,
        referentielsError,
        refetchReferentiels,
        invalidateReferentielsCache
    } = useReferentiel()

    const paginatedReferentiels = useMemo(() => {
        const start = (page - 1) * pageSize
        const end = start + pageSize
        return referentiels.slice(start, end)
    }, [page, pageSize, referentiels])

    const hasNextPage = page * pageSize < referentiels.length

    useEffect(() => {
        const maxPage = Math.max(1, Math.ceil(referentiels.length / pageSize))
        if (page > maxPage) {
            setPage(maxPage)
        }
    }, [page, pageSize, referentiels.length])

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

    const refreshReferentiels = useCallback(() => {
        void refetchReferentiels()
    }, [refetchReferentiels])

    const handleCreateAction = useCallback((action: string) => {
        if (action !== 'created') return
        setPage(1)
        void invalidateReferentielsCache().then(() => refetchReferentiels())
    }, [invalidateReferentielsCache, refetchReferentiels])

    const handleDeleteAction = useCallback((action: string) => {
        if (action !== 'deleted') return
        void invalidateReferentielsCache().then(() => refetchReferentiels())
        closeDeletePopup()
    }, [closeDeletePopup, invalidateReferentielsCache, refetchReferentiels])

    return {
        token,
        page,
        pageSize,
        referentiels: paginatedReferentiels,
        referentielsLoading,
        referentielsError,
        hasNextPage,
        isCreatePopupOpen,
        isDeletePopupOpen,
        selectedReferentiel,
        setPage,
        openCreatePopup,
        closeCreatePopup,
        openDeletePopup,
        closeDeletePopup,
        refreshReferentiels,
        handleCreateAction,
        handleDeleteAction
    }
}
