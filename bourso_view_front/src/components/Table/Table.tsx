import { TableHeader, type TableColumn } from './TableHeader'

type TableProps<T> = {
    columns: TableColumn<T>[]
    data: T[]
    emptyMessage?: string
}

export function Table<T extends Record<string, unknown>>({
    columns,
    data,
    emptyMessage = 'Aucune donnée à afficher.'
}: TableProps<T>) {
    if (!data || data.length === 0) {
        return (
            <div className="my-5 rounded-2xl bg-surface-card backdrop-blur-sm border border-white/5 p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">Aucune donnée</h3>
                <p className="text-text-muted mt-2 max-w-md mx-auto">{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className="my-5 overflow-hidden rounded-2xl border-0 md:border md:border-white/5 bg-transparent md:bg-surface-card md:backdrop-blur-sm">
            <table className="w-full border-collapse text-sm block md:table">
                <TableHeader columns={columns} />

                <tbody className="block md:table-row-group">
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="
                                block md:table-row mb-4 border border-white/5 rounded-2xl bg-surface-card md:bg-transparent md:mb-0 md:border-none md:rounded-none
                                transition-colors duration-200 hover:bg-primary/5 md:border-b md:border-white/5 md:last:border-0
                            "
                        >
                            {columns.map((col) => (
                                <td
                                    key={`${rowIndex}-${String(col.accessor)}`}
                                    data-label={col.header}
                                    className="
                                        block md:table-cell relative p-4 pl-[50%] md:pl-4 text-right md:text-left text-text
                                        border-b border-white/5 last:border-b-0 md:border-none
                                        before:content-[attr(data-label)] before:absolute before:left-4 before:w-[45%] before:whitespace-nowrap before:text-left before:font-medium before:text-text-muted md:before:content-none
                                    "
                                >
                                    {col.render ? col.render(row) : String(row[col.accessor] ?? '')}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
