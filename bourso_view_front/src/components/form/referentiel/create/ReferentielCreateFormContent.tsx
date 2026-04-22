import { ReferentielCreateFormView } from './ReferentielCreateFormView.tsx'
import { useReferentielCreateForm, type CreateReferentielFormPayload } from './useReferentielCreateForm.ts'

type ReferentielCreateFormContentProps = {
    onCreated?: () => void
}

export function ReferentielCreateFormContent({ onCreated }: ReferentielCreateFormContentProps) {
    const { form, errorMessage, isSubmitting, onChange, onSubmit } = useReferentielCreateForm({ onCreated })

    return (
        <ReferentielCreateFormView
            form={form}
            errorMessage={errorMessage}
            isSubmitting={isSubmitting}
            onChange={onChange}
            onSubmit={onSubmit}
        />
    )
}

export type { CreateReferentielFormPayload }
