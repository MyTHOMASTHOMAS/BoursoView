import { createRoute } from "MypkgAppsScript/ProcessRouter";
import { Validator as V, ContextType as CT, ResponseType as RT } from "Shared/RouteType";
import { defaultStartProcess } from "../defaultStartProcess";
import referentiel from "../../../service/core/referentiel";

const createReferentielProcess = defaultStartProcess<CT.CreateReferentielAction>()
    .result((ctx) => ({
        createdCount: referentiel.create.create(ctx.contents)
    }));

const createReferentielLogic = (
    e: GoogleAppsScript.Events.DoPost,
    contents: CT.CreateReferentielAction
) => {
    return createReferentielProcess.execute({ e, contents });
};

export const createReferentielRoute = createRoute<RT.CreateReferentielAction>()({
    contentsValidator: V.createReferentielAction,
    routeLogic: createReferentielLogic
});
