import { createRoute } from "MypkgAppsScript/ProcessRouter";
import { Validator as V, ContextType as CT, ResponseType as RT } from "Shared/RouteType";
import { defaultStartProcess } from "../defaultStartProcess";
import fund from "../../../service/core/fund";

const createFundProcess = defaultStartProcess<CT.CreateFundAction>()
    .result((ctx) => ({
        createdCount: fund.create.create(ctx.contents)
    }));

const createFundLogic = (
    e: GoogleAppsScript.Events.DoPost,
    contents: CT.CreateFundAction
) => {
    return createFundProcess.execute({ e, contents });
};

export const createFundRoute = createRoute<RT.CreateFundAction>()({
    contentsValidator: V.createFundAction,
    routeLogic: createFundLogic
});
