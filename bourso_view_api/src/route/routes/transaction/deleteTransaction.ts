import { createRoute } from "MypkgAppsScript/ProcessRouter";
import { Validator as V, ContextType as CT, ResponseType as RT } from "Shared/RouteType";
import { defaultStartProcess } from "../defaultStartProcess";
import transaction from "../../../service/core/transaction";

const deleteTransactionProcess = defaultStartProcess<CT.DeleteTransactionAction>()
    .result((ctx) => ({
        deleted: transaction.delete.delete(ctx.contents.line)
    }));

const deleteTransactionLogic = (
    e: GoogleAppsScript.Events.DoPost,
    contents: CT.DeleteTransactionAction
) => {
    return deleteTransactionProcess.execute({ e, contents });
};

export const deleteTransactionRoute = createRoute<RT.DeleteTransactionAction>()({
    contentsValidator: V.deleteTransactionAction,
    routeLogic: deleteTransactionLogic
});
