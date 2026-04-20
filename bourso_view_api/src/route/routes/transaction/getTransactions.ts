import { createRoute } from "MypkgAppsScript/ProcessRouter";
import { Validator as V, ContextType as CT, ResponseType as RT } from "Shared/RouteType";
import { defaultStartProcess } from "../defaultStartProcess";
import transaction from "../../../service/core/transaction";

const getTransactionsProcess = defaultStartProcess<CT.GetTransactionsAction>()
    .result((ctx) => ({
        transactions: transaction.read.getMany({
            limit: ctx.contents.limit,
            offset: ctx.contents.offset
        })
    }));

const getTransactionsLogic = (
    e: GoogleAppsScript.Events.DoPost,
    contents: CT.GetTransactionsAction
) => {
    return getTransactionsProcess.execute({ e, contents });
};

export const getTransactionsRoute = createRoute<RT.GetTransactionsAction>()({
    contentsValidator: V.getTransactionsAction,
    routeLogic: getTransactionsLogic
});
