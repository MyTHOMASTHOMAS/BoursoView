import { TransactionDeleteFormView } from './TransactionDeleteFormView.tsx'
import { useTransactionDeleteForm, type DeleteTransactionFormPayload } from './useTransactionDeleteForm.ts'

type TransactionDeleteFormContentProps = {
    line: number
    transactionId?: string
    onDeleted?: () => void
    onCancel?: () => void
}

export function TransactionDeleteFormContent({
    line,
    transactionId,
    onDeleted,
    onCancel
}: TransactionDeleteFormContentProps) {
    const { errorMessage, isSubmitting, onSubmit } = useTransactionDeleteForm({
        line,
        onDeleted,
        onCancel
    })

    return (
        <TransactionDeleteFormView
            transactionId={transactionId}
            line={line}
            errorMessage={errorMessage}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    )
}

export type { DeleteTransactionFormPayload }
