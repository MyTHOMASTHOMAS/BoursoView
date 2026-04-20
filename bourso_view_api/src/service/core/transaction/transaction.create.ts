import { db } from "../../sheet";
import type { CreateTransactionAction } from "Shared/RouteType/Context";

export default {
    create(transaction: CreateTransactionAction) {
        const transactionRepository = db.getRepository("transaction");

        // Les colonnes readonly (titre, pru, total) sont ignorees par l'ORM a l'ecriture.
        return transactionRepository.create([transaction]);
    }
};
