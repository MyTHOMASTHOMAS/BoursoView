import { createRoute } from "MypkgAppsScript/ProcessRouter";
import { Validator as V, ContextType as CT, ResponseType as RT } from "Shared/RouteType";
import { defaultStartProcess } from "../defaultStartProcess";
import resume from "../../../service/core/resume";

const getResumeProcess = defaultStartProcess<CT.GetResumeAction>()
    .result(() => resume.read.get());

const getResumeLogic = (
    e: GoogleAppsScript.Events.DoPost,
    contents: CT.GetResumeAction
) => {
    return getResumeProcess.execute({ e, contents });
};

/**
 * Route de récupération du résumé portefeuille (feuille Resume).
 */
export const getResumeRoute = createRoute<RT.GetResumeAction>()({
    contentsValidator: V.getResumeAction,
    routeLogic: getResumeLogic
});
