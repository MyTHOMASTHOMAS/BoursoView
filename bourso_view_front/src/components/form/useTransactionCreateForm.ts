import { useState, type ChangeEvent, type FormEvent } from 'react'
import { type ContextType as CT, Validator as V } from 'Shared/RouteType'
import { api } from '../../api/api'
import { useAppStore } from '../../store/useAppStore'
import { useReferentiel } from '../../store/wallet/slices/referentielSlice'

export type CreateTransactionFormPayload = Omit<CT.CreateTransactionAction, 'authToken'>

export type TransactionCreateFormState = {
    id: string
    date: string
    price: string
    nb: string
    commission: string
    fee: string
}

type UseTransactionCreateFormOptions = {
    onCreated?: () => void
}

function validateWithSharedValidator(body: CT.CreateTransactionAction): { valid: boolean; message?: string } {
    const validator = V.createTransactionAction as any

    try {
        if (typeof validator?.isValid === 'function') {
            const valid = Boolean(validator.isValid(body))
            return { valid, message: valid ? undefined : 'Validation du formulaire échouée.' }
        }

        if (typeof validator?.validate === 'function') {
            const result = validator.validate(body)

            if (typeof result === 'boolean') {
                return { valid: result, message: result ? undefined : 'Validation du formulaire échouée.' }
            }

            if (result && typeof result === 'object') {
                if (typeof result.success === 'boolean') {
                    return { valid: result.success, message: result.success ? undefined : (result.error ?? 'Validation du formulaire échouée.') }
                }
                if (typeof result.valid === 'boolean') {
                    return { valid: result.valid, message: result.valid ? undefined : (result.error ?? 'Validation du formulaire échouée.') }
                }
            }
        }

        return { valid: true }
    } catch (error) {
        return {
            valid: false,
            message: error instanceof Error ? error.message : 'Validation du formulaire échouée.'
        }
    }
}

const initialFormState: TransactionCreateFormState = {
    id: '',
    date: '',
    price: '',
    nb: '',
    commission: '',
    fee: ''
}

export function useTransactionCreateForm({ onCreated }: UseTransactionCreateFormOptions = {}) {
    const token = useAppStore((state) => state.token)
    const { referentielIds } = useReferentiel()
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [form, setForm] = useState<TransactionCreateFormState>(initialFormState)

    const createTransaction = api.createTransaction.useMutation.post({
        onSuccess: (response) => {
            if (response?.success === true) {
                setErrorMessage(null)
                setForm(initialFormState)
                onCreated?.()
                return
            }

            setErrorMessage(response?.error ?? 'Impossible de créer la transaction.')
        },
        onError: (error) => {
            setErrorMessage(error instanceof Error ? error.message : 'Erreur inattendue.')
        }
    })

    const onChange =
        (field: keyof TransactionCreateFormState) =>
            (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                setForm((prev) => ({ ...prev, [field]: event.target.value }))
            }

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!token) {
            setErrorMessage("Aucun token d'authentification disponible.")
            return
        }

        const values: CreateTransactionFormPayload = {
            id: form.id.trim(),
            date: form.date,
            price: Number(form.price),
            nb: Number(form.nb),
            commission: Number(form.commission),
            fee: Number(form.fee)
        }

        if (
            !values.id ||
            !values.date ||
            !Number.isFinite(values.price) ||
            !Number.isFinite(values.nb) ||
            !Number.isFinite(values.commission) ||
            !Number.isFinite(values.fee)
        ) {
            setErrorMessage('Veuillez renseigner un formulaire valide.')
            return
        }

        const isoDate = new Date(values.date)
        if (Number.isNaN(isoDate.getTime())) {
            setErrorMessage('Date invalide.')
            return
        }

        const requestBody: CT.CreateTransactionAction = {
            authToken: token,
            id: values.id,
            date: isoDate.toISOString(),
            price: values.price,
            nb: values.nb,
            commission: values.commission,
            fee: values.fee
        }

        const validation = validateWithSharedValidator(requestBody)
        if (!validation.valid) {
            setErrorMessage(validation.message ?? 'Validation du formulaire échouée.')
            return
        }

        createTransaction.mutate({ body: requestBody })
    }

    return {
        form,
        referentielIds,
        errorMessage,
        isSubmitting: createTransaction.isPending,
        onChange,
        onSubmit
    }
}
