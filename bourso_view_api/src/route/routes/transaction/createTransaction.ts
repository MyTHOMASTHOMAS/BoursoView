import { createRoute } from "MypkgAppsScript/ProcessRouter";
import { Validator as V, ContextType as CT, ResponseType as RT } from "Shared/RouteType";
import { defaultStartProcess } from "../defaultStartProcess";
import transaction from "../../../service/core/transaction";

const createTransactionProcess = defaultStartProcess<CT.CreateTransactionAction>()
    .result((ctx) => ({
        createdCount: transaction.create.create(ctx.contents)
    }));

const createTransactionLogic = (
    e: GoogleAppsScript.Events.DoPost,
    contents: CT.CreateTransactionAction
) => {
    return createTransactionProcess.execute({ e, contents });
};

export const createTransactionRoute = createRoute<RT.CreateTransactionAction>()({
    contentsValidator: V.createTransactionAction,
    routeLogic: createTransactionLogic
});
