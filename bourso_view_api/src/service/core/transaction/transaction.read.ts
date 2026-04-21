import { db } from "../../sheet";
import type { TransactionItem } from "Shared/RouteType/Response";

type GetManyFilters = {
    limit: number;
    offset: number;
};

export default {
    getMany(filters: GetManyFilters) {
        const transactionRepository = db.getRepository("transaction");
        const lastRow = transactionRepository.getLastRow();

        // Pas de lignes de donnees (startPos est ligne 2 -> index 1)
        if (lastRow < 1) {
            return [] as TransactionItem[];
        }

        // TODO: typer l'ORM pour que getRepository("transaction").getMany() retourne TransactionItem[]
        return transactionRepository.getMany(filters, {direction: "desc"}) as TransactionItem[];
    }
};
