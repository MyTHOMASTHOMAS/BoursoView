import { FonsPageView } from './FonsPageView'
import { useFonsPage } from './useFonsPage'

export default function Fons() {
    const fonsPage = useFonsPage()

    return <FonsPageView {...fonsPage} />
}
