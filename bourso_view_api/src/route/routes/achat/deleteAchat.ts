import { createRoute } from "MypkgAppsScript/ProcessRouter";
import { Validator as V, ContextType as CT, ResponseType as RT } from "Shared/RouteType";
import { defaultStartProcess } from "../defaultStartProcess";
import achat from "../../../service/core/achat";

const deleteAchatProcess = defaultStartProcess<CT.DeleteAchatAction>()
    .result((ctx) => ({
        deleted: achat.delete.delete(ctx.contents.line)
    }));

const deleteAchatLogic = (
    e: GoogleAppsScript.Events.DoPost,
    contents: CT.DeleteAchatAction
) => {
    return deleteAchatProcess.execute({ e, contents });
};

export const deleteAchatRoute = createRoute<RT.DeleteAchatAction>()({
    contentsValidator: V.deleteAchatAction,
    routeLogic: deleteAchatLogic
});
