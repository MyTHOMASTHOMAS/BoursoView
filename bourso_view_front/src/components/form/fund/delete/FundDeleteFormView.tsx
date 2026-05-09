import type { FormEvent } from 'react'
import { ModalFormView } from '../../ModalFormView.tsx'

type FundDeleteFormViewProps = {
    line: number
    errorMessage: string | null
    isSubmitting: boolean
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
    onCancel?: () => void
}

export function FundDeleteFormView({
    line,
    errorMessage,
    isSubmitting,
    onSubmit,
    onCancel
}: FundDeleteFormViewProps) {
    return (
        <ModalFormView
            title="Confirmer la suppression du fond ?"
            details={`Ligne concernee: ${line}`}
            errorMessage={errorMessage}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={onCancel}
            cancelLabel="Annuler"
            submitLabel="Supprimer"
            submittingLabel="Suppression..."
            confirmVariant="danger"
        />
    )
}
