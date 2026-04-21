import { TransactionCreateFormContent } from '../../../form'
import { AbstractPopupContent, type PopupContentBaseProps } from '../../AbstractPopupContent'

type TransactionCreateFormPopupElementProps = PopupContentBaseProps

/**
 * Adaptateur popup pour le formulaire de création de transaction.
 * Sert de pont entre PopupWindow (contenu abstrait) et le formulaire autonome.
 */
export class TransactionCreateFormPopupElement extends AbstractPopupContent<TransactionCreateFormPopupElementProps> {
    protected renderContent() {
        return (
            <TransactionCreateFormContent
                onCreated={() => {
                    this.emitAction('created')
                    this.closePopup()
                }}
            />
        )
    }
}
