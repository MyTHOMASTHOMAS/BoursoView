import { FundDeleteFormContent } from '../../../form/fund/delete'
import { AbstractPopupContent, type PopupContentBaseProps } from '../../AbstractPopupContent'

type FundDeleteFormPopupElementProps = PopupContentBaseProps & {
    line: number
}

export class FundDeleteFormPopupElement extends AbstractPopupContent<FundDeleteFormPopupElementProps> {
    protected renderContent() {
        return (
            <FundDeleteFormContent
                line={this.props.line}
                onDeleted={() => {
                    this.emitAction('deleted', { line: this.props.line })
                    this.closePopup()
                }}
                onCancel={() => {
                    this.closePopup()
                }}
            />
        )
    }
}
