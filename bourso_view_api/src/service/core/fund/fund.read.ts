import { db } from "../../sheet";
import type { FundItem } from "Shared/RouteType/Response";

type GetManyFilters = {
    limit: number;
    offset: number;
};

export default {
    getMany(filters: GetManyFilters) {
        const fundRepository = db.getRepository("fund");
        const lastRow = fundRepository.getLastRow();

        if (lastRow < 1) {
            return [] as FundItem[];
        }

        return fundRepository.getMany(filters, { direction: "desc" }) as FundItem[];
    }
};
