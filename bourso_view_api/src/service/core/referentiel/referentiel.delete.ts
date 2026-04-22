import { db } from "../../sheet";

export default {
    delete(line: number) {
        const referentielRepository = db.getRepository("referentiel");
        return referentielRepository.delete(line);
    }
};
