import { TransactionsPageView } from './TransactionsPageView'
import { useTransactionsPage } from './useTransactionsPage'

export default function Transactions() {
    const transactionsPage = useTransactionsPage()

    return <TransactionsPageView {...transactionsPage} />
}
