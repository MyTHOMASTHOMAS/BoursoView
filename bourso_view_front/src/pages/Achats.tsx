import { Table, type TableColumn } from '../components/Table'
import { useAchats, useAppStore } from '../store'
import type { ResponseType as RT } from 'Shared/RouteType'

const columns: TableColumn<RT.AchatItem>[] = [
    { header: 'ID', accessor: 'id' },
    { header: 'Titre', accessor: 'titre' },
    { header: 'Date', accessor: 'date' },
    { header: 'Prix', accessor: 'price' },
    { header: 'Quantité', accessor: 'nb' },
    { header: 'Commission', accessor: 'commission' },
    { header: 'Frais', accessor: 'fee' },
    { header: 'PRU', accessor: 'pru' },
    { header: 'Total', accessor: 'total' },
]

export default function Achats() {
    const token = useAppStore((state) => state.token)
    const {
        achats,
        achatsLoading,
        achatsError,
        refetchAchats
    } = useAchats()

    if (!token) {
        return (
            <div className="space-y-3">
                <h1 className="text-heading-xl text-primary">Achats</h1>
                <p className="text-muted">Aucun token d'authentification disponible.</p>
            </div>
        )
    }

    if (achatsLoading) {
        return <p className="text-muted">Chargement des achats...</p>
    }

    if (achatsError) {
        return (
            <div className="space-y-3">
                <p className="text-error">Erreur: {achatsError}</p>
                <button
                    onClick={() => void refetchAchats()}
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
                    <h1 className="text-heading-xl text-primary">Achats</h1>
                    <p className="mt-1 text-muted">
                        Visualisation de vos lignes d'achats.
                    </p>
                </div>
                <button
                    onClick={() => void refetchAchats()}
                    className="btn-padding radius-btn border border-subtle text-primary hover:surface-hover transition-colors cursor-pointer"
                >
                    Rafraichir
                </button>
            </div>

            <Table
                columns={columns}
                data={achats}
                emptyMessage="Aucun achat disponible."
            />
        </div>
    )
}
