import { createRoute } from "MypkgAppsScript/ProcessRouter";
import { Validator as V, ContextType as CT, ResponseType as RT } from "Shared/RouteType";
import { defaultStartProcess } from "../defaultStartProcess";
import history from "../../../service/core/history";

const getHistoryProcess = defaultStartProcess<CT.GetHistoryAction>()
    .result((ctx) => history.read.get(ctx.contents));

const getHistoryLogic = (
    e: GoogleAppsScript.Events.DoPost,
    contents: CT.GetHistoryAction
) => {
    return getHistoryProcess.execute({ e, contents });
};

export const getHistoryRoute = createRoute<RT.GetHistoryAction>()({
    contentsValidator: V.getHistoryAction,
    routeLogic: getHistoryLogic
});
