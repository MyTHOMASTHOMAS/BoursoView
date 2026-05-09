import { createRoute } from "MypkgAppsScript/ProcessRouter";
import { Validator as V, ContextType as CT, ResponseType as RT } from "Shared/RouteType";
import { defaultStartProcess } from "../defaultStartProcess";
import fund from "../../../service/core/fund";

const getFundsProcess = defaultStartProcess<CT.GetFundsAction>()
    .result((ctx) => ({
        funds: fund.read.getMany({
            limit: ctx.contents.limit,
            offset: ctx.contents.offset
        })
    }));

const getFundsLogic = (
    e: GoogleAppsScript.Events.DoPost,
    contents: CT.GetFundsAction
) => {
    return getFundsProcess.execute({ e, contents });
};

export const getFundsRoute = createRoute<RT.GetFundsAction>()({
    contentsValidator: V.getFundsAction,
    routeLogic: getFundsLogic
});
