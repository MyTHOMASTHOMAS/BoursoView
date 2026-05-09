import { db } from "../../sheet";
import type { CreateFundAction } from "Shared/RouteType/Context";

export default {
    create(fund: CreateFundAction) {
        const fundRepository = db.getRepository("fund");
        return fundRepository.create([fund]);
    }
};
