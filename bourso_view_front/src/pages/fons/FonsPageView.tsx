import { useMemo } from 'react'
import { PaginatedTable, TableActionsMenu, type TableColumn } from '../../components/Table'
import { PopupWindow, FundCreateFormPopupElement, FundDeleteFormPopupElement } from '../../components/popup'
import type { ResponseType as RT } from 'Shared/RouteType'
import type { useFonsPage } from './useFonsPage'

type FonsPageViewProps = ReturnType<typeof useFonsPage>

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

export function FonsPageView({
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
}: FonsPageViewProps) {
    const columns = useMemo<TableColumn<RT.FundItem>[]>(() => [
        {
            header: 'Date',
            accessor: 'date',
            render: (row) => formatIsoDateForDisplay(row.date)
        },
        { header: 'Montant', accessor: 'montant' },
        { header: 'Total', accessor: 'total' },
        {
            header: 'Actions',
            accessor: '_line',
            render: (row) => (
                <TableActionsMenu
                    buttonAriaLabel={`Actions pour le fond ligne ${row._line}`}
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
                <h1 className="text-heading-xl text-primary">Fonds</h1>
                <p className="text-muted">Aucun token d'authentification disponible.</p>
            </div>
        )
    }

    if (fundsError) {
        return (
            <div className="space-y-3">
                <p className="text-error">Erreur: {fundsError}</p>
                <button
                    onClick={refreshFunds}
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
                    <h1 className="text-heading-xl text-primary">Fonds</h1>
                    <p className="mt-1 text-muted">
                        Visualisation de vos lignes de fonds.
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
                    onClick={refreshFunds}
                    className="btn-padding radius-btn border border-subtle text-primary hover:surface-hover transition-colors cursor-pointer"
                >
                    Rafraichir
                </button>
            </div>

            <PaginatedTable
                columns={columns}
                data={funds}
                emptyMessage="Aucun fond disponible."
                loadingMessage="Chargement des fonds..."
                page={page}
                pageSize={pageSize}
                hasNextPage={hasNextPage}
                isLoading={fundsLoading}
                onPageChange={setPage}
            />

            <PopupWindow
                isOpen={isCreatePopupOpen}
                title="Ajouter un fond"
                onClose={closeCreatePopup}
                onAction={handleCreateAction}
                ContentComponent={FundCreateFormPopupElement}
            />

            {selectedFund && (
                <PopupWindow
                    isOpen={isDeletePopupOpen}
                    title="Supprimer le fond"
                    onClose={closeDeletePopup}
                    onAction={handleDeleteAction}
                    ContentComponent={FundDeleteFormPopupElement}
                    contentProps={{
                        line: selectedFund._line
                    }}
                />
            )}
        </div>
    )
}
