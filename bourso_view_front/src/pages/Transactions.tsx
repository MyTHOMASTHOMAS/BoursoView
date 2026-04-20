import { useMemo, useState } from 'react'
import { PaginatedTable, type TableColumn } from '../components/Table'
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
    const hours = date.getHours()
    const minutes = date.getMinutes()

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
        refetchTransactions
    } = useTransactions(paginationOptions)

    const hasNextPage = transactions.length === pageSize

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
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-heading-xl text-primary">Transactions</h1>
                    <p className="mt-1 text-muted">
                        Visualisation de vos lignes de transactions.
                    </p>
                </div>
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
        </div>
    )
}
