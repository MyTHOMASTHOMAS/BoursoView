import type { ChangeEvent, FormEvent } from 'react'
import type { TransactionCreateFormState } from './useTransactionCreateForm'

type TransactionCreateFormViewProps = {
    form: TransactionCreateFormState
    referentielIds: string[]
    errorMessage: string | null
    isSubmitting: boolean
    onChange: (
        field: keyof TransactionCreateFormState
    ) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function TransactionCreateFormView({
    form,
    referentielIds,
    errorMessage,
    isSubmitting,
    onChange,
    onSubmit
}: TransactionCreateFormViewProps) {
    return (
        <form
            onSubmit={onSubmit}
            className="space-y-4 rounded-xl border border-subtle bg-slate-900/80 p-4"
        >
            {errorMessage && (
                <p className="text-error text-sm">{errorMessage}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select
                    value={form.id}
                    onChange={onChange('id')}
                    required
                    className="w-full btn-padding border border-white/20 radius-btn bg-slate-800/90 text-white focus:outline-none focus:border-primary transition-colors"
                >
                    <option value="">Sélectionner un ID</option>
                    {referentielIds.map((id) => (
                        <option key={id} value={id}>
                            {id}
                        </option>
                    ))}
                </select>
                <input
                    type="datetime-local"
                    value={form.date}
                    onChange={onChange('date')}
                    required
                    className="w-full btn-padding border border-white/20 radius-btn bg-slate-800/90 text-white focus:outline-none focus:border-primary transition-colors"
                />
                <input
                    type="number"
                    step="0.0001"
                    placeholder="Prix"
                    value={form.price}
                    onChange={onChange('price')}
                    required
                    className="w-full btn-padding border border-white/20 radius-btn bg-slate-800/90 text-white placeholder:text-slate-300 focus:outline-none focus:border-primary transition-colors"
                />
                <input
                    type="number"
                    step="0.0001"
                    placeholder="Quantité"
                    value={form.nb}
                    onChange={onChange('nb')}
                    required
                    className="w-full btn-padding border border-white/20 radius-btn bg-slate-800/90 text-white placeholder:text-slate-300 focus:outline-none focus:border-primary transition-colors"
                />
                <input
                    type="number"
                    step="0.0001"
                    placeholder="Commission"
                    value={form.commission}
                    onChange={onChange('commission')}
                    required
                    className="w-full btn-padding border border-white/20 radius-btn bg-slate-800/90 text-white placeholder:text-slate-300 focus:outline-none focus:border-primary transition-colors"
                />
                <input
                    type="number"
                    step="0.0001"
                    placeholder="Frais"
                    value={form.fee}
                    onChange={onChange('fee')}
                    required
                    className="w-full btn-padding border border-white/20 radius-btn bg-slate-800/90 text-white placeholder:text-slate-300 focus:outline-none focus:border-primary transition-colors"
                />
            </div>

            <div className="flex items-center justify-end gap-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-padding radius-btn btn-primary transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Ajout...' : 'Ajouter'}
                </button>
            </div>
        </form>
    )
}
