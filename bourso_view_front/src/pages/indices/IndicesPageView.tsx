import { useMemo } from 'react'
import { Table, TableActionsMenu, type TableColumn } from '../../components/Table'
import { PriceTrendHoverCard } from '../../components/smart-display'
import {
    PopupWindow,
    HistoryDetailsPopupElement,
    ReferentielCreateFormPopupElement,
    ReferentielDeleteFormPopupElement
} from '../../components/popup'
import type { ResponseType as RT } from 'Shared/RouteType'
import type { useIndicesPage } from './useIndicesPage'

type IndicesPageViewProps = ReturnType<typeof useIndicesPage>

export function IndicesPageView({
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
}: IndicesPageViewProps) {
    const columns = useMemo<TableColumn<RT.ReferentielItem>[]>(() => [
        { header: 'ID', accessor: 'id' },
        { header: 'Nom', accessor: 'name' },
        { header: 'ISIN', accessor: 'isin' },
        { header: 'Frais de gestion (%)', accessor: 'management_fee' },
        {
            header: 'Evolution',
            accessor: 'price',
            render: (row) => (
                <PriceTrendHoverCard
                    price={row.price}
                    price_j_1={row.estimated_j_1}
                    price_j_7={row.estimated_j_7}
                    price_m_1={row.estimated_1_mois}
                />
            )
        },
        {
            header: 'Actions',
            accessor: '_line',
            render: (row) => (
                <TableActionsMenu
                    buttonAriaLabel={`Actions pour le referentiel ${row.id}`}
                    options={[
                        {
                            id: 'details',
                            label: 'Details',
                            onSelect: () => openDetailsPopup(row)
                        },
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
    ], [openDeletePopup, openDetailsPopup])

    if (!token) {
        return (
            <div className="space-y-3">
                <h1 className="text-heading-xl text-primary">Indices</h1>
                <p className="text-muted">Aucun token d'authentification disponible.</p>
            </div>
        )
    }

    if (referentielsError) {
        return (
            <div className="space-y-3">
                <p className="text-error">Erreur: {referentielsError}</p>
                <button
                    onClick={refreshReferentiels}
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
                    <h1 className="text-heading-xl text-primary">Indices</h1>
                    <p className="mt-1 text-muted">
                        Liste des referentiels disponibles.
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
                    onClick={refreshReferentiels}
                    className="btn-padding radius-btn border border-subtle text-primary hover:surface-hover transition-colors cursor-pointer"
                >
                    Rafraichir
                </button>
            </div>

            <Table
                columns={columns}
                data={referentiels}
                onLoad={referentielsLoading}
                loadingMessage="Chargement des referentiels..."
                emptyMessage="Aucun referentiel disponible."
            />

            <PopupWindow
                isOpen={isCreatePopupOpen}
                title="Ajouter un referentiel"
                onClose={closeCreatePopup}
                onAction={handleCreateAction}
                ContentComponent={ReferentielCreateFormPopupElement}
            />

            {selectedReferentiel && (
                <PopupWindow
                    isOpen={isDeletePopupOpen}
                    title="Supprimer le referentiel"
                    onClose={closeDeletePopup}
                    onAction={handleDeleteAction}
                    ContentComponent={ReferentielDeleteFormPopupElement}
                    contentProps={{
                        line: selectedReferentiel._line,
                        referentielId: selectedReferentiel.id
                    }}
                />
            )}

            {token && selectedDetailsReferentiel && (
                <PopupWindow
                    isOpen={isDetailsPopupOpen}
                    title={`Historique ${selectedDetailsReferentiel.id}`}
                    onClose={closeDetailsPopup}
                    ContentComponent={HistoryDetailsPopupElement}
                    contentProps={{
                        indice: selectedDetailsReferentiel.id,
                        authToken: token
                    }}
                />
            )}
        </div>
    )
}
