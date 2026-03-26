export type TableColumn<T> = {
    header: string
    accessor: keyof T
    render?: (row: T) => React.ReactNode
}

type TableHeaderProps<T> = {
    columns: TableColumn<T>[]
}

export function TableHeader<T>({ columns }: TableHeaderProps<T>) {
    return (
        <thead className="block md:table-header-group">
            <tr className="absolute -top-[9999px] -left-[9999px] md:static md:table-row">
                {columns.map((col) => (
                    <th
                        key={String(col.accessor)}
                        className="
                            block md:table-cell px-4 py-3 text-left font-semibold text-text-muted
                            bg-surface-header border-b border-white/5 text-xs uppercase tracking-wider
                        "
                    >
                        {col.header}
                    </th>
                ))}
            </tr>
        </thead>
    )
}
