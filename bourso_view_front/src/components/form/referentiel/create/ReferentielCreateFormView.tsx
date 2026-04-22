import type { ChangeEvent, FormEvent } from 'react'
import type { ReferentielCreateFormState } from './useReferentielCreateForm.ts'

type ReferentielCreateFormViewProps = {
    form: ReferentielCreateFormState
    errorMessage: string | null
    isSubmitting: boolean
    onChange: (field: keyof ReferentielCreateFormState) => (event: ChangeEvent<HTMLInputElement>) => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function ReferentielCreateFormView({
    form,
    errorMessage,
    isSubmitting,
    onChange,
    onSubmit
}: ReferentielCreateFormViewProps) {
    return (
        <form
            onSubmit={onSubmit}
            className="space-y-4 rounded-xl border border-subtle bg-slate-900/80 p-4"
        >
            {errorMessage && (
                <p className="text-error text-sm">{errorMessage}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                    type="text"
                    placeholder="ID"
                    value={form.id}
                    onChange={onChange('id')}
                    required
                    className="w-full btn-padding border border-white/20 radius-btn bg-slate-800/90 text-white placeholder:text-slate-300 focus:outline-none focus:border-primary transition-colors"
                />
                <input
                    type="text"
                    placeholder="Nom"
                    value={form.name}
                    onChange={onChange('name')}
                    required
                    className="w-full btn-padding border border-white/20 radius-btn bg-slate-800/90 text-white placeholder:text-slate-300 focus:outline-none focus:border-primary transition-colors"
                />
                <input
                    type="text"
                    placeholder="ISIN"
                    value={form.isin}
                    onChange={onChange('isin')}
                    required
                    className="w-full btn-padding border border-white/20 radius-btn bg-slate-800/90 text-white placeholder:text-slate-300 focus:outline-none focus:border-primary transition-colors"
                />
                <input
                    type="number"
                    step="0.0001"
                    placeholder="Frais de gestion (%)"
                    value={form.management_fee}
                    onChange={onChange('management_fee')}
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
