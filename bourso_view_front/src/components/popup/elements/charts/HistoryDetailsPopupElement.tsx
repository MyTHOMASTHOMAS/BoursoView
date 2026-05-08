import { BasicCharts } from '../../../charts/BasicCharts'
import { AbstractPopupContent, type PopupContentBaseProps } from '../../AbstractPopupContent'

type HistoryDetailsPopupElementProps = PopupContentBaseProps & {
    indice: string
    authToken: string
}

export class HistoryDetailsPopupElement extends AbstractPopupContent<HistoryDetailsPopupElementProps> {
    protected renderContent() {
        return <BasicCharts indice={this.props.indice} authToken={this.props.authToken} />
    }
}
