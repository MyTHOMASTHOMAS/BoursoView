import type { FormEvent, ReactNode } from 'react'

type ModalFormViewProps = {
    title: string
    details?: ReactNode
    errorMessage: string | null
    isSubmitting: boolean
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
    onCancel?: () => void
    cancelLabel: string
    submitLabel: string
    submittingLabel: string
    confirmVariant?: 'danger' | 'primary'
}

export function ModalFormView({
    title,
    details,
    errorMessage,
    isSubmitting,
    onSubmit,
    onCancel,
    cancelLabel,
    submitLabel,
    submittingLabel,
    confirmVariant = 'primary'
}: ModalFormViewProps) {
    const confirmButtonClassName = confirmVariant === 'danger'
        ? 'btn-padding radius-btn border border-red-500/60 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
        : 'btn-padding radius-btn btn-primary transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'

    return (
        <form
            onSubmit={onSubmit}
            className="space-y-4 rounded-xl border border-subtle bg-slate-900/80 p-4"
        >
            <div className="space-y-1">
                <p className="text-white">{title}</p>
                {details && <div className="text-sm text-muted">{details}</div>}
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
                    {cancelLabel}
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={confirmButtonClassName}
                >
                    {isSubmitting ? submittingLabel : submitLabel}
                </button>
            </div>
        </form>
    )
}
