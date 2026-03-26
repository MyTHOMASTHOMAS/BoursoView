import { db } from "../../sheet";
import type { AchatItem } from "Shared/RouteType/Response";

type GetManyFilters = {
    limit: number;
    offset: number;
};

export default {
    getMany(filters: GetManyFilters) {
        const achatRepository = db.getRepository("achat");
        const lastRow = achatRepository.getLastRow();

        // Pas de lignes de donnees (startPos est ligne 2 -> index 1)
        if (lastRow < 1) {
            return [] as AchatItem[];
        }

        // TODO: typer l'ORM pour que getRepository("achat").getMany() retourne AchatItem[]
        return achatRepository.getMany(filters) as AchatItem[];
    }
};
