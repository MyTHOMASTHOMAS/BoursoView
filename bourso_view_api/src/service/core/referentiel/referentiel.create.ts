import { db } from "../../sheet";
import type { CreateReferentielAction } from "Shared/RouteType/Context";

export default {
    create(referentiel: CreateReferentielAction) {
        const referentielRepository = db.getRepository("referentiel");

        // La colonne readonly (price) est ignoree par l'ORM a l'ecriture.
        return referentielRepository.create([referentiel]);
    }
};
