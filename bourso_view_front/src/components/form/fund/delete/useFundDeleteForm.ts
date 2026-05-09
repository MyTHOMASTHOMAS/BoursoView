import { useState, type FormEvent } from 'react'
import { type ContextType as CT, Validator as V } from 'Shared/RouteType'
import { api } from '../../../../api/api.ts'
import { useAppStore } from '../../../../store/useAppStore.ts'

export type DeleteFundFormPayload = Omit<CT.DeleteFundAction, 'authToken'>

type UseFundDeleteFormOptions = {
    line: number
    onDeleted?: () => void
    onCancel?: () => void
}

function validateWithSharedValidator(body: CT.DeleteFundAction): { valid: boolean; message?: string } {
    const result = V.deleteFundAction.validate(body)

    if (result.isValid) {
        return { valid: true }
    }

    const firstError = result.errors?.[0]
    if (!firstError) {
        return { valid: false, message: 'Validation de la suppression echouee.' }
    }

    const details = [firstError.id, firstError.key].filter(Boolean).join(' / ')
    return {
        valid: false,
        message: details
            ? `Validation de la suppression echouee (${details}).`
            : 'Validation de la suppression echouee.'
    }
}

export function useFundDeleteForm({ line, onDeleted, onCancel }: UseFundDeleteFormOptions) {
    const token = useAppStore((state) => state.token)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const deleteFund = api.deleteFund.useMutation.post({
        onSuccess: (response) => {
            if (response?.success === true && response.data?.deleted === true) {
                setErrorMessage(null)
                onDeleted?.()
                return
            }

            if (response?.success === false) {
                setErrorMessage(response.error ?? 'Impossible de supprimer le fond.')
                return
            }

            setErrorMessage('Impossible de supprimer le fond.')
        },
        onError: (error) => {
            setErrorMessage(error instanceof Error ? error.message : 'Erreur inattendue.')
        }
    })

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!token) {
            setErrorMessage("Aucun token d'authentification disponible.")
            return
        }

        if (!Number.isFinite(line) || line <= 0) {
            setErrorMessage('Ligne de fond invalide.')
            return
        }

        const requestBody: CT.DeleteFundAction = {
            authToken: token,
            line
        }

        const validation = validateWithSharedValidator(requestBody)
        if (!validation.valid) {
            setErrorMessage(validation.message ?? 'Validation de la suppression echouee.')
            return
        }

        deleteFund.mutate({ body: requestBody })
    }

    return {
        errorMessage,
        isSubmitting: deleteFund.isPending,
        onSubmit,
        onCancel
    }
}
