import { FundCreateFormView } from './FundCreateFormView.tsx'
import { useFundCreateForm, type CreateFundFormPayload } from './useFundCreateForm.ts'

type FundCreateFormContentProps = {
    onCreated?: () => void
}

export function FundCreateFormContent({ onCreated }: FundCreateFormContentProps) {
    const { form, errorMessage, isSubmitting, onChange, onSubmit } = useFundCreateForm({ onCreated })

    return (
        <FundCreateFormView
            form={form}
            errorMessage={errorMessage}
            isSubmitting={isSubmitting}
            onChange={onChange}
            onSubmit={onSubmit}
        />
    )
}

export type { CreateFundFormPayload }
