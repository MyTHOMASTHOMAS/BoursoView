import { db } from "../../sheet";
import {ReferentielItem} from "Shared/RouteType/Response"

export default {
    getAll() {
        const referentielRepository = db.getRepository("referentiel");
        const lastRow = referentielRepository.getLastRow();

        // Pas de lignes de donnees (startPos est ligne 2 -> index 1)
        if (lastRow < 1) {
            return [] as ReferentielItem[];
        }

        // TODO: typer l'ORM pour que getRepository("referentiel").getMany() retourne
        return referentielRepository.getMany() as ReferentielItem[]
    }
};