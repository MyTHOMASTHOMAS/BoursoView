import { ReferentielCreateFormContent } from '../../../form/referentiel/create'
import { AbstractPopupContent, type PopupContentBaseProps } from '../../AbstractPopupContent'

type ReferentielCreateFormPopupElementProps = PopupContentBaseProps

/**
 * Adaptateur popup pour le formulaire de création de referentiel.
 * Sert de pont entre PopupWindow (contenu abstrait) et le formulaire autonome.
 */
export class ReferentielCreateFormPopupElement extends AbstractPopupContent<ReferentielCreateFormPopupElementProps> {
    protected renderContent() {
        return (
            <ReferentielCreateFormContent
                onCreated={() => {
                    this.emitAction('created')
                    this.closePopup()
                }}
            />
        )
    }
}
