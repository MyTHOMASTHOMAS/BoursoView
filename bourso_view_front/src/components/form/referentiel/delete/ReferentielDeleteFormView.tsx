import type { FormEvent } from 'react'
import { ModalFormView } from '../../ModalFormView.tsx'

type ReferentielDeleteFormViewProps = {
    referentielId?: string
    line: number
    errorMessage: string | null
    isSubmitting: boolean
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
    onCancel?: () => void
}

export function ReferentielDeleteFormView({
    referentielId,
    line,
    errorMessage,
    isSubmitting,
    onSubmit,
    onCancel
}: ReferentielDeleteFormViewProps) {
    return (
        <ModalFormView
            title={`Confirmer la suppression du referentiel${referentielId ? ` ${referentielId}` : ''} ?`}
            details={`Ligne concernée: ${line}`}
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
