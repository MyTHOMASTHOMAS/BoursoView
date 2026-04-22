import { createRoute } from "MypkgAppsScript/ProcessRouter";
import { Validator as V, ContextType as CT, ResponseType as RT } from "Shared/RouteType";
import { defaultStartProcess } from "../defaultStartProcess";
import referentiel from "../../../service/core/referentiel";

const deleteReferentielProcess = defaultStartProcess<CT.DeleteReferentielAction>()
    .result((ctx) => ({
        deleted: referentiel.delete.delete(ctx.contents.line)
    }));

const deleteReferentielLogic = (
    e: GoogleAppsScript.Events.DoPost,
    contents: CT.DeleteReferentielAction
) => {
    return deleteReferentielProcess.execute({ e, contents });
};

export const deleteReferentielRoute = createRoute<RT.DeleteReferentielAction>()({
    contentsValidator: V.deleteReferentielAction,
    routeLogic: deleteReferentielLogic
});
