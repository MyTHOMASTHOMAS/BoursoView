import { createRoute } from "MypkgAppsScript/ProcessRouter";
import { Validator as V, ContextType as CT, ResponseType as RT } from "Shared/RouteType";
import { defaultStartProcess } from "../defaultStartProcess";
import achat from "../../../service/core/achat";

const getAchatsProcess = defaultStartProcess<CT.GetAchatsAction>()
    .result((ctx) => ({
        achats: achat.read.getMany({
            limit: ctx.contents.limit,
            offset: ctx.contents.offset
        })
    }));

const getAchatsLogic = (
    e: GoogleAppsScript.Events.DoPost,
    contents: CT.GetAchatsAction
) => {
    return getAchatsProcess.execute({ e, contents });
};

export const getAchatsRoute = createRoute<RT.GetAchatAction>()({
    contentsValidator: V.getAchatsAction,
    routeLogic: getAchatsLogic
});
