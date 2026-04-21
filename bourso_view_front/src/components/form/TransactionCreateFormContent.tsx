import { TransactionCreateFormView } from './TransactionCreateFormView'
import { useTransactionCreateForm, type CreateTransactionFormPayload } from './useTransactionCreateForm'

type TransactionCreateFormContentProps = {
    onCreated?: () => void
}

export function TransactionCreateFormContent({ onCreated }: TransactionCreateFormContentProps) {
    const { form, referentielIds, errorMessage, isSubmitting, onChange, onSubmit } = useTransactionCreateForm({ onCreated })

    return (
        <TransactionCreateFormView
            form={form}
            referentielIds={referentielIds}
            errorMessage={errorMessage}
            isSubmitting={isSubmitting}
            onChange={onChange}
            onSubmit={onSubmit}
        />
    )
}

export type { CreateTransactionFormPayload }
