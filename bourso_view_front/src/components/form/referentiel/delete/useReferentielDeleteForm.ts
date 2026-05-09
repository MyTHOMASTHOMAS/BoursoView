import { useState, type FormEvent } from 'react'
import { type ContextType as CT, Validator as V } from 'Shared/RouteType'
import { api } from '../../../../api/api.ts'
import { useAppStore } from '../../../../store'

export type DeleteReferentielFormPayload = Omit<CT.DeleteReferentielAction, 'authToken'>

type UseReferentielDeleteFormOptions = {
    line: number
    onDeleted?: () => void
    onCancel?: () => void
}

function validateWithSharedValidator(body: CT.DeleteReferentielAction): { valid: boolean; message?: string } {
    const result = V.deleteReferentielAction.validate(body)

    if (result.isValid) {
        return { valid: true }
    }

    const firstError = result.errors?.[0]
    if (!firstError) {
        return { valid: false, message: 'Validation de la suppression échouée.' }
    }

    const details = [firstError.id, firstError.key].filter(Boolean).join(' / ')
    return {
        valid: false,
        message: details
            ? `Validation de la suppression échouée (${details}).`
            : 'Validation de la suppression échouée.'
    }
}

export function useReferentielDeleteForm({ line, onDeleted, onCancel }: UseReferentielDeleteFormOptions) {
    const token = useAppStore((state) => state.token)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const deleteReferentiel = api.deleteReferentiel.useMutation.post({
        onSuccess: (response) => {
            if (response?.success === true && response.data?.deleted === true) {
                setErrorMessage(null)
                onDeleted?.()
                return
            }

            if (response?.success === false) {
                setErrorMessage(response.error ?? 'Impossible de supprimer le referentiel.')
                return
            }

            setErrorMessage('Impossible de supprimer le referentiel.')
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
            setErrorMessage('Ligne de referentiel invalide.')
            return
        }

        const requestBody: CT.DeleteReferentielAction = {
            authToken: token,
            line
        }

        const validation = validateWithSharedValidator(requestBody)
        if (!validation.valid) {
            setErrorMessage(validation.message ?? 'Validation de la suppression échouée.')
            return
        }

        deleteReferentiel.mutate({ body: requestBody })
    }

    return {
        errorMessage,
        isSubmitting: deleteReferentiel.isPending,
        onSubmit,
        onCancel
    }
}
