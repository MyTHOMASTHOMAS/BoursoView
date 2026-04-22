import { IndicesPageView } from './IndicesPageView'
import { useIndicesPage } from './useIndicesPage'

export default function Indices() {
    const indicesPage = useIndicesPage()

    return <IndicesPageView {...indicesPage} />
}
