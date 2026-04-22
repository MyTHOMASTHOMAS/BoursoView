import { ReferentielDeleteFormContent } from '../../../form/referentiel/delete'
import { AbstractPopupContent, type PopupContentBaseProps } from '../../AbstractPopupContent'

type ReferentielDeleteFormPopupElementProps = PopupContentBaseProps & {
    line: number
    referentielId?: string
}

/**
 * Adaptateur popup pour la suppression d'un referentiel.
 * Sert de pont entre PopupWindow (contenu abstrait) et le formulaire autonome.
 */
export class ReferentielDeleteFormPopupElement extends AbstractPopupContent<ReferentielDeleteFormPopupElementProps> {
    protected renderContent() {
        return (
            <ReferentielDeleteFormContent
                line={this.props.line}
                referentielId={this.props.referentielId}
                onDeleted={() => {
                    this.emitAction('deleted', { line: this.props.line, referentielId: this.props.referentielId })
                    this.closePopup()
                }}
                onCancel={() => {
                    this.closePopup()
                }}
            />
        )
    }
}
