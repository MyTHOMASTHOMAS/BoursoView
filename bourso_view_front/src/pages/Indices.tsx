import { Table, type TableColumn } from '../components/Table'
import { useReferentiel } from '../store'
import type { ResponseType as RT } from 'Shared/RouteType'

const columns: TableColumn<RT.ReferentielItem>[] = [
    { header: 'Nom', accessor: 'name' },
    { header: 'ISIN', accessor: 'isin' },
    { header: 'Frais de gestion (%)', accessor: 'management_fee' },
    { header: 'Prix (€)', accessor: 'price' },
]

export default function Indices() {
    const {
        referentiels,
        referentielsLoading,
        referentielsError,
        refetchReferentiels
    } = useReferentiel()

    if (referentielsError) {
        return (
            <div className="space-y-3">
                <p className="text-error">Erreur: {referentielsError}</p>
                <button
                    onClick={() => void refetchReferentiels()}
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
            <div className="flex justify-end">
                <button
                    onClick={() => void refetchReferentiels()}
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
        </div>
    )
}
