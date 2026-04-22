import { useCallback, useMemo, useState } from 'react'
import { useTransactions, useAppStore } from '../../store'
import type { ResponseType as RT } from 'Shared/RouteType'

export function useTransactionsPage() {
    const [page, setPage] = useState(1)
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false)
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState<RT.TransactionItem | null>(null)
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
        transactions,
        transactionsLoading,
        transactionsError,
        refetchTransactions,
        invalidateTransactionsCache
    } = useTransactions(paginationOptions)

    const hasNextPage = transactions.length === pageSize

    const openCreatePopup = useCallback(() => {
        setIsCreatePopupOpen(true)
    }, [])

    const closeCreatePopup = useCallback(() => {
        setIsCreatePopupOpen(false)
    }, [])

    const openDeletePopup = useCallback((transaction: RT.TransactionItem) => {
        setSelectedTransaction(transaction)
        setIsDeletePopupOpen(true)
    }, [])

    const closeDeletePopup = useCallback(() => {
        setIsDeletePopupOpen(false)
        setSelectedTransaction(null)
    }, [])

    const refreshTransactions = useCallback(() => {
        void refetchTransactions()
    }, [refetchTransactions])

    const handleCreateAction = useCallback((action: string) => {
        if (action !== 'created') return
        setPage(1)
        void invalidateTransactionsCache().then(() => refetchTransactions())
    }, [invalidateTransactionsCache, refetchTransactions])

    const handleDeleteAction = useCallback((action: string) => {
        if (action !== 'deleted') return
        void invalidateTransactionsCache().then(() => refetchTransactions())
        closeDeletePopup()
    }, [closeDeletePopup, invalidateTransactionsCache, refetchTransactions])

    return {
        token,
        page,
        pageSize,
        transactions,
        transactionsLoading,
        transactionsError,
        hasNextPage,
        isCreatePopupOpen,
        isDeletePopupOpen,
        selectedTransaction,
        setPage,
        openCreatePopup,
        closeCreatePopup,
        openDeletePopup,
        closeDeletePopup,
        refreshTransactions,
        handleCreateAction,
        handleDeleteAction
    }
}
