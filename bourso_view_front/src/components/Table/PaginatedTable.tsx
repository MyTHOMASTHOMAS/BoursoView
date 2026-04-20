import { Table } from './Table'
import type { TableColumn } from './TableHeader'

type PaginatedTableProps<T extends Record<string, unknown>> = {
    columns: TableColumn<T>[]
    data: T[]
    emptyMessage?: string
    loadingMessage?: string
    page: number
    pageSize: number
    onPageChange: (nextPage: number) => void
    hasNextPage: boolean
    isLoading?: boolean
}

export function PaginatedTable<T extends Record<string, unknown>>({
    columns,
    data,
    emptyMessage,
    loadingMessage = 'Chargement des données...',
    page,
    pageSize,
    onPageChange,
    hasNextPage,
    isLoading = false
}: PaginatedTableProps<T>) {
    const canGoPrevious = page > 1 && !isLoading
    const canGoNext = hasNextPage && !isLoading
    const firstRowNumber = (page - 1) * pageSize + 1
    const lastRowNumber = (page - 1) * pageSize + data.length

    return (
        <div className="space-y-3">
            <Table
                columns={columns}
                data={data}
                emptyMessage={emptyMessage}
                onLoad={isLoading}
                loadingMessage={loadingMessage}
            />

            <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted">
                    {data.length > 0
                        ? `Lignes ${firstRowNumber}-${lastRowNumber} (page ${page})`
                        : `Page ${page}`}
                </p>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={!canGoPrevious}
                        className="btn-padding radius-btn border border-subtle text-primary hover:surface-hover transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Précédent
                    </button>
                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={!canGoNext}
                        className="btn-padding radius-btn border border-subtle text-primary hover:surface-hover transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Suivant
                    </button>
                </div>
            </div>
        </div>
    )
}
