import { db } from "../../sheet";

export default {
    delete(line: number) {
        const fundRepository = db.getRepository("fund");
        return fundRepository.delete(line);
    }
};
