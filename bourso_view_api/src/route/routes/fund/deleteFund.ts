import { createRoute } from "MypkgAppsScript/ProcessRouter";
import { Validator as V, ContextType as CT, ResponseType as RT } from "Shared/RouteType";
import { defaultStartProcess } from "../defaultStartProcess";
import fund from "../../../service/core/fund";

const deleteFundProcess = defaultStartProcess<CT.DeleteFundAction>()
    .result((ctx) => ({
        deleted: fund.delete.delete(ctx.contents.line)
    }));

const deleteFundLogic = (
    e: GoogleAppsScript.Events.DoPost,
    contents: CT.DeleteFundAction
) => {
    return deleteFundProcess.execute({ e, contents });
};

export const deleteFundRoute = createRoute<RT.DeleteFundAction>()({
    contentsValidator: V.deleteFundAction,
    routeLogic: deleteFundLogic
});
