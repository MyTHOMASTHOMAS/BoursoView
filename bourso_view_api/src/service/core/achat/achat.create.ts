import { db } from "../../sheet";
import type { CreateAchatAction } from "Shared/RouteType/Context";

export default {
    create(achat: CreateAchatAction) {
        const achatRepository = db.getRepository("achat");

        // Les colonnes readonly (titre, pru, total) sont ignorees par l'ORM a l'ecriture.
        return achatRepository.create([achat]);
    }
};
