import { createRoute } from "MypkgAppsScript/ProcessRouter";
import { Validator as V, ContextType as CT, ResponseType as RT } from "Shared/RouteType";
import {defaultStartProcess} from "../defaultStartProcess";
import referentiel from "../../../service/core/referentiel";

const getReferentielProcess = defaultStartProcess
    .result(() => ({
        referentiels: referentiel.read.getAll()
    }));

const getReferentielLogic = (
    e: GoogleAppsScript.Events.DoPost,
    contents: CT.GetReferentielAction
) => {
    return getReferentielProcess.execute({ e, contents });
};

/**
 * Route de recuperation des referentiels.
 */
export const getReferentielRoute = createRoute<RT.GetReferentielAction>()({
    contentsValidator: V.getReferentielAction,
    routeLogic: getReferentielLogic
});
