import { ReferentielDeleteFormView } from './ReferentielDeleteFormView.tsx'
import { useReferentielDeleteForm, type DeleteReferentielFormPayload } from './useReferentielDeleteForm.ts'

type ReferentielDeleteFormContentProps = {
    line: number
    referentielId?: string
    onDeleted?: () => void
    onCancel?: () => void
}

export function ReferentielDeleteFormContent({
    line,
    referentielId,
    onDeleted,
    onCancel
}: ReferentielDeleteFormContentProps) {
    const { errorMessage, isSubmitting, onSubmit } = useReferentielDeleteForm({
        line,
        onDeleted,
        onCancel
    })

    return (
        <ReferentielDeleteFormView
            referentielId={referentielId}
            line={line}
            errorMessage={errorMessage}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    )
}

export type { DeleteReferentielFormPayload }
