import { useCallback, useMemo, useState } from 'react'
import { useFunds, useAppStore } from '../../store'
import type { ResponseType as RT } from 'Shared/RouteType'

export function useFonsPage() {
    const [page, setPage] = useState(1)
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false)
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
    const [selectedFund, setSelectedFund] = useState<RT.FundItem | null>(null)
    const pageSize = 5
    const token = useAppStore((state) => state.token)

    const paginationOptions = useMemo(
        () => ({
            limit: pageSize,
            offset: (page - 1) * pageSize
        }),
        [page]
    )

    const {
        funds,
        fundsLoading,
        fundsError,
        refetchFunds,
        invalidateFundsCache
    } = useFunds(paginationOptions)

    const hasNextPage = funds.length === pageSize

    const openCreatePopup = useCallback(() => {
        setIsCreatePopupOpen(true)
    }, [])

    const closeCreatePopup = useCallback(() => {
        setIsCreatePopupOpen(false)
    }, [])

    const openDeletePopup = useCallback((fund: RT.FundItem) => {
        setSelectedFund(fund)
        setIsDeletePopupOpen(true)
    }, [])

    const closeDeletePopup = useCallback(() => {
        setIsDeletePopupOpen(false)
        setSelectedFund(null)
    }, [])

    const refreshFunds = useCallback(() => {
        void refetchFunds()
    }, [refetchFunds])

    const handleCreateAction = useCallback((action: string) => {
        if (action !== 'created') return
        setPage(1)
        void invalidateFundsCache().then(() => refetchFunds())
    }, [invalidateFundsCache, refetchFunds])

    const handleDeleteAction = useCallback((action: string) => {
        if (action !== 'deleted') return
        void invalidateFundsCache().then(() => refetchFunds())
        closeDeletePopup()
    }, [closeDeletePopup, invalidateFundsCache, refetchFunds])

    return {
        token,
        page,
        pageSize,
        funds,
        fundsLoading,
        fundsError,
        hasNextPage,
        isCreatePopupOpen,
        isDeletePopupOpen,
        selectedFund,
        setPage,
        openCreatePopup,
        closeCreatePopup,
        openDeletePopup,
        closeDeletePopup,
        refreshFunds,
        handleCreateAction,
        handleDeleteAction
    }
}
