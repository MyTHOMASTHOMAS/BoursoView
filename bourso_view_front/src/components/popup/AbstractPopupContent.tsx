import { Component, type ReactNode } from 'react'

export type PopupContentBaseProps = {
    onClose: () => void
    onAction?: (action: string, payload?: unknown) => void
}

/**
 * Classe abstraite pour tout contenu affiché dans une popup.
 * Les composants concrets doivent hériter de cette classe.
 */
export abstract class AbstractPopupContent<
    TProps extends PopupContentBaseProps = PopupContentBaseProps,
    TState = Record<string, never>
> extends Component<TProps, TState> {
    protected closePopup = () => {
        this.props.onClose()
    }

    protected emitAction = (action: string, payload?: unknown) => {
        this.props.onAction?.(action, payload)
    }

    protected abstract renderContent(): ReactNode

    override render() {
        return this.renderContent()
    }
}
