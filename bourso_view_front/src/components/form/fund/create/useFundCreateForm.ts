import { useState, type ChangeEvent, type FormEvent } from 'react'
import { type ContextType as CT, Validator as V } from 'Shared/RouteType'
import { api } from '../../../../api/api.ts'
import { useAppStore } from '../../../../store'

export type CreateFundFormPayload = Omit<CT.CreateFundAction, 'authToken'>

export type FundCreateFormState = {
    date: string
    montant: string
}

type UseFundCreateFormOptions = {
    onCreated?: () => void
}

const initialFormState: FundCreateFormState = {
    date: '',
    montant: ''
}

function validateWithSharedValidator(body: CT.CreateFundAction): { valid: boolean; message?: string } {
    const result = V.createFundAction.validate(body)

    if (result.isValid) {
        return { valid: true }
    }

    const firstError = result.errors?.[0]
    if (!firstError) {
        return { valid: false, message: 'Validation du formulaire echouee.' }
    }

    const details = [firstError.id, firstError.key].filter(Boolean).join(' / ')
    return {
        valid: false,
        message: details
            ? `Validation du formulaire echouee (${details}).`
            : 'Validation du formulaire echouee.'
    }
}

export function useFundCreateForm({ onCreated }: UseFundCreateFormOptions = {}) {
    const token = useAppStore((state) => state.token)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [form, setForm] = useState<FundCreateFormState>(initialFormState)

    const createFund = api.createFund.useMutation.post({
        onSuccess: (response) => {
            if (response?.success === true) {
                setErrorMessage(null)
                setForm(initialFormState)
                onCreated?.()
                return
            }

            setErrorMessage(response?.error ?? 'Impossible de creer le fond.')
        },
        onError: (error) => {
            setErrorMessage(error instanceof Error ? error.message : 'Erreur inattendue.')
        }
    })

    const onChange =
        (field: keyof FundCreateFormState) =>
            (event: ChangeEvent<HTMLInputElement>) => {
                setForm((prev) => ({ ...prev, [field]: event.target.value }))
            }

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!token) {
            setErrorMessage("Aucun token d'authentification disponible.")
            return
        }

        const values: CreateFundFormPayload = {
            date: form.date,
            montant: Number(form.montant)
        }

        if (!values.date || !Number.isFinite(values.montant)) {
            setErrorMessage('Veuillez renseigner un formulaire valide.')
            return
        }

        const isoDate = new Date(values.date)
        if (Number.isNaN(isoDate.getTime())) {
            setErrorMessage('Date invalide.')
            return
        }

        const requestBody: CT.CreateFundAction = {
            authToken: token,
            date: isoDate.toISOString(),
            montant: values.montant
        }

        const validation = validateWithSharedValidator(requestBody)
        if (!validation.valid) {
            setErrorMessage(validation.message ?? 'Validation du formulaire echouee.')
            return
        }

        createFund.mutate({ body: requestBody })
    }

    return {
        form,
        errorMessage,
        isSubmitting: createFund.isPending,
        onChange,
        onSubmit
    }
}
