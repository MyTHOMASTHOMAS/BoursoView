import { TransactionDeleteFormContent } from '../../../form/transaction/delete'
import { AbstractPopupContent, type PopupContentBaseProps } from '../../AbstractPopupContent'

type TransactionDeleteFormPopupElementProps = PopupContentBaseProps & {
    line: number
    transactionId?: string
}

/**
 * Adaptateur popup pour la suppression d'une transaction.
 * Sert de pont entre PopupWindow (contenu abstrait) et le formulaire autonome.
 */
export class TransactionDeleteFormPopupElement extends AbstractPopupContent<TransactionDeleteFormPopupElementProps> {
    protected renderContent() {
        return (
            <TransactionDeleteFormContent
                line={this.props.line}
                transactionId={this.props.transactionId}
                onDeleted={() => {
                    this.emitAction('deleted', { line: this.props.line, transactionId: this.props.transactionId })
                    this.closePopup()
                }}
                onCancel={() => {
                    this.closePopup()
                }}
            />
        )
    }
}
