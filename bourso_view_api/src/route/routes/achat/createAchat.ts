import { createRoute } from "MypkgAppsScript/ProcessRouter";
import { Validator as V, ContextType as CT, ResponseType as RT } from "Shared/RouteType";
import { defaultStartProcess } from "../defaultStartProcess";
import achat from "../../../service/core/achat";

const createAchatProcess = defaultStartProcess<CT.CreateAchatAction>()
    .result((ctx) => ({
        createdCount: achat.create.create(ctx.contents)
    }));

const createAchatLogic = (
    e: GoogleAppsScript.Events.DoPost,
    contents: CT.CreateAchatAction
) => {
    return createAchatProcess.execute({ e, contents });
};

export const createAchatRoute = createRoute<RT.CreateAchatAction>()({
    contentsValidator: V.createAchatAction,
    routeLogic: createAchatLogic
});
