import { useState, type ChangeEvent, type FormEvent } from 'react'
import { type ContextType as CT, Validator as V } from 'Shared/RouteType'
import { api } from '../../../../api/api.ts'
import { useAppStore } from '../../../../store'

export type CreateReferentielFormPayload = Omit<CT.CreateReferentielAction, 'authToken'>

export type ReferentielCreateFormState = {
    id: string
    name: string
    isin: string
    management_fee: string
}

type UseReferentielCreateFormOptions = {
    onCreated?: () => void
}

const initialFormState: ReferentielCreateFormState = {
    id: '',
    name: '',
    isin: '',
    management_fee: ''
}

function validateWithSharedValidator(body: CT.CreateReferentielAction): { valid: boolean; message?: string } {
    const result = V.createReferentielAction.validate(body)

    if (result.isValid) {
        return { valid: true }
    }

    const firstError = result.errors?.[0]
    if (!firstError) {
        return { valid: false, message: 'Validation du formulaire échouée.' }
    }

    const details = [firstError.id, firstError.key].filter(Boolean).join(' / ')
    return {
        valid: false,
        message: details
            ? `Validation du formulaire échouée (${details}).`
            : 'Validation du formulaire échouée.'
    }
}

export function useReferentielCreateForm({ onCreated }: UseReferentielCreateFormOptions = {}) {
    const token = useAppStore((state) => state.token)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [form, setForm] = useState<ReferentielCreateFormState>(initialFormState)

    const createReferentiel = api.createReferentiel.useMutation.post({
        onSuccess: (response) => {
            if (response?.success === true) {
                setErrorMessage(null)
                setForm(initialFormState)
                onCreated?.()
                return
            }

            setErrorMessage(response?.error ?? 'Impossible de créer le referentiel.')
        },
        onError: (error) => {
            setErrorMessage(error instanceof Error ? error.message : 'Erreur inattendue.')
        }
    })

    const onChange =
        (field: keyof ReferentielCreateFormState) =>
            (event: ChangeEvent<HTMLInputElement>) => {
                setForm((prev) => ({ ...prev, [field]: event.target.value }))
            }

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!token) {
            setErrorMessage("Aucun token d'authentification disponible.")
            return
        }

        const values: CreateReferentielFormPayload = {
            id: form.id.trim(),
            name: form.name.trim(),
            isin: form.isin.trim(),
            management_fee: Number(form.management_fee)
        }

        if (!values.id || !values.name || !values.isin || !Number.isFinite(values.management_fee)) {
            setErrorMessage('Veuillez renseigner un formulaire valide.')
            return
        }

        const requestBody: CT.CreateReferentielAction = {
            authToken: token,
            id: values.id,
            name: values.name,
            isin: values.isin,
            management_fee: values.management_fee
        }

        const validation = validateWithSharedValidator(requestBody)
        if (!validation.valid) {
            setErrorMessage(validation.message ?? 'Validation du formulaire échouée.')
            return
        }

        createReferentiel.mutate({ body: requestBody })
    }

    return {
        form,
        errorMessage,
        isSubmitting: createReferentiel.isPending,
        onChange,
        onSubmit
    }
}
