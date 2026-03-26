import { db } from "../../sheet";

export default {
    delete(line: number) {
        const achatRepository = db.getRepository("achat");
        return achatRepository.delete(line);
    }
};
