import { db } from "../../sheet";

export default {
    delete(line: number) {
        const transactionRepository = db.getRepository("transaction");
        return transactionRepository.delete(line);
    }
};
