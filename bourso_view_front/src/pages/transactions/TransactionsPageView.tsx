import { useMemo } from 'react'
import { PaginatedTable, TableActionsMenu, type TableColumn } from '../../components/Table'
import { PopupWindow, TransactionCreateFormPopupElement, TransactionDeleteFormPopupElement } from '../../components/popup'
import type { ResponseType as RT } from 'Shared/RouteType'
import type { useTransactionsPage } from './useTransactionsPage'

type TransactionsPageViewProps = ReturnType<typeof useTransactionsPage>

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

export function TransactionsPageView({
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
}: TransactionsPageViewProps) {
    const columns = useMemo<TableColumn<RT.TransactionItem>[]>(() => [
        { header: 'ID', accessor: 'id' },
        { header: 'Titre', accessor: 'titre' },
        {
            header: 'Date',
            accessor: 'date',
            render: (row) => formatIsoDateForDisplay(row.date)
        },
        { header: 'Prix', accessor: 'price' },
        { header: 'Quantité', accessor: 'nb' },
        { header: 'Commission', accessor: 'commission' },
        { header: 'Frais', accessor: 'fee' },
        { header: 'PRU', accessor: 'pru' },
        { header: 'Total', accessor: 'total' },
        {
            header: 'Actions',
            accessor: '_line',
            render: (row) => (
                <TableActionsMenu
                    buttonAriaLabel={`Actions pour la transaction ${row.id}`}
                    options={[
                        {
                            id: 'delete',
                            label: 'Supprimer',
                            danger: true,
                            onSelect: () => openDeletePopup(row)
                        }
                    ]}
                />
            )
        }
    ], [openDeletePopup])

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
                    onClick={refreshTransactions}
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
                    onClick={openCreatePopup}
                    className="btn-padding radius-btn btn-primary transition-colors cursor-pointer"
                >
                    Ajouter
                </button>
                <button
                    onClick={refreshTransactions}
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
                onClose={closeCreatePopup}
                onAction={handleCreateAction}
                ContentComponent={TransactionCreateFormPopupElement}
            />

            {selectedTransaction && (
                <PopupWindow
                    isOpen={isDeletePopupOpen}
                    title="Supprimer la transaction"
                    onClose={closeDeletePopup}
                    onAction={handleDeleteAction}
                    ContentComponent={TransactionDeleteFormPopupElement}
                    contentProps={{
                        line: selectedTransaction._line,
                        transactionId: selectedTransaction.id
                    }}
                />
            )}
        </div>
    )
}
