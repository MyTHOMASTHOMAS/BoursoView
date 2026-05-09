import { FundCreateFormContent } from '../../../form/fund/create'
import { AbstractPopupContent, type PopupContentBaseProps } from '../../AbstractPopupContent'

type FundCreateFormPopupElementProps = PopupContentBaseProps

export class FundCreateFormPopupElement extends AbstractPopupContent<FundCreateFormPopupElementProps> {
    protected renderContent() {
        return (
            <FundCreateFormContent
                onCreated={() => {
                    this.emitAction('created')
                    this.closePopup()
                }}
            />
        )
    }
}
