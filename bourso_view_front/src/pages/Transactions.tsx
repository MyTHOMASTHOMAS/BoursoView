import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { PaginatedTable, type TableColumn } from '../components/Table'
import { PopupWindow, TransactionCreateFormPopupElement } from '../components/popup'
import { useTransactions, useAppStore } from '../store'
import type { ResponseType as RT } from 'Shared/RouteType'

function formatIsoDateForDisplay(isoDate: string): string {
    const date = new Date(isoDate)

    if (Number.isNaN(date.getTime())) {
        return isoDate
    }

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${day}/${month}/${year} - ${hours}:${minutes}`
}

const columns: TableColumn<RT.TransactionItem>[] = [
    { header: 'ID', accessor: 'id' },
    { header: 'Titre', accessor: 'titre' },
    {
        header: 'Date',
        accessor: 'date',
        render: (row) => formatIsoDateForDisplay(row.date as string)
    },
    { header: 'Prix', accessor: 'price' },
    { header: 'Quantité', accessor: 'nb' },
    { header: 'Commission', accessor: 'commission' },
    { header: 'Frais', accessor: 'fee' },
    { header: 'PRU', accessor: 'pru' },
    { header: 'Total', accessor: 'total' },
]

export default function Transactions() {
    const [page, setPage] = useState(1)
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false)
    const pageSize = 5
    const queryClient = useQueryClient()
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
        refetchTransactions
    } = useTransactions(paginationOptions)

    const hasNextPage = transactions.length === pageSize

    const invalidateTransactionsCache = () => {
        return queryClient.invalidateQueries({
            predicate: (query) =>
                Array.isArray(query.queryKey) &&
                query.queryKey.some((key) => key === 'getTransactions')
        })
    }

    if (!token) {
        return (
            <div className="space-y-3">
                <h1 className="text-heading-xl text-primary">Transactions</h1>
                <p className="text-muted">Aucun token d'authentification disponible.</p>
            </div>
        )
    }

    if (transactionsError) {
        return (
            <div className="space-y-3">
                <p className="text-error">Erreur: {transactionsError}</p>
                <button
                    onClick={() => void refetchTransactions()}
                    className="btn-padding radius-btn btn-primary transition-colors cursor-pointer"
                >
                    Reessayer
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div>
                <div>
                    <h1 className="text-heading-xl text-primary">Transactions</h1>
                    <p className="mt-1 text-muted">
                        Visualisation de vos lignes de transactions.
                    </p>
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <button
                    onClick={() => setIsCreatePopupOpen(true)}
                    className="btn-padding radius-btn btn-primary transition-colors cursor-pointer"
                >
                    Ajouter
                </button>
                <button
                    onClick={() => void refetchTransactions()}
                    className="btn-padding radius-btn border border-subtle text-primary hover:surface-hover transition-colors cursor-pointer"
                >
                    Rafraichir
                </button>
            </div>

            <PaginatedTable
                columns={columns}
                data={transactions}
                emptyMessage="Aucune transaction disponible."
                loadingMessage="Chargement des transactions..."
                page={page}
                pageSize={pageSize}
                hasNextPage={hasNextPage}
                isLoading={transactionsLoading}
                onPageChange={setPage}
            />

            <PopupWindow
                isOpen={isCreatePopupOpen}
                title="Ajouter une transaction"
                onClose={() => setIsCreatePopupOpen(false)}
                onAction={(action) => {
                    if (action !== 'created') return
                    setPage(1)
                    void invalidateTransactionsCache().then(() => refetchTransactions())
                }}
                ContentComponent={TransactionCreateFormPopupElement}
            />
        </div>
    )
}
