import type { FormEvent } from 'react'

type TransactionDeleteFormViewProps = {
    transactionId?: string
    line: number
    errorMessage: string | null
    isSubmitting: boolean
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
    onCancel?: () => void
}

export function TransactionDeleteFormView({
    transactionId,
    line,
    errorMessage,
    isSubmitting,
    onSubmit,
    onCancel
}: TransactionDeleteFormViewProps) {
    return (
        <form
            onSubmit={onSubmit}
            className="space-y-4 rounded-xl border border-subtle bg-slate-900/80 p-4"
        >
            <div className="space-y-1">
                <p className="text-white">
                    Confirmer la suppression de la transaction
                    {transactionId ? ` ${transactionId}` : ''} ?
                </p>
                <p className="text-sm text-muted">Ligne concernée: {line}</p>
            </div>

            {errorMessage && (
                <p className="text-error text-sm">{errorMessage}</p>
            )}

            <div className="flex items-center justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="btn-padding radius-btn border border-subtle text-primary hover:surface-hover transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-padding radius-btn border border-red-500/60 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Suppression...' : 'Supprimer'}
                </button>
            </div>
        </form>
    )
}
