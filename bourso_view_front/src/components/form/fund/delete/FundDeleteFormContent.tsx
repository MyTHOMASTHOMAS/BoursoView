import { FundDeleteFormView } from './FundDeleteFormView.tsx'
import { useFundDeleteForm, type DeleteFundFormPayload } from './useFundDeleteForm.ts'

type FundDeleteFormContentProps = {
    line: number
    onDeleted?: () => void
    onCancel?: () => void
}

export function FundDeleteFormContent({
    line,
    onDeleted,
    onCancel
}: FundDeleteFormContentProps) {
    const { errorMessage, isSubmitting, onSubmit } = useFundDeleteForm({
        line,
        onDeleted,
        onCancel
    })

    return (
        <FundDeleteFormView
            line={line}
            errorMessage={errorMessage}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    )
}

export type { DeleteFundFormPayload }
