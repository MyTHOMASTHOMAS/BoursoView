import { createProcessRouter, type PostRouteRegistry } from "MypkgAppsScript/ProcessRouter";
import { authRoute } from "./routes/auth";
import { getHistoryRoute } from "./routes/history/getHistory";
import { createReferentielRoute } from "./routes/referentiel/createReferentiel";
import { deleteReferentielRoute } from "./routes/referentiel/deleteReferentiel";
import { getReferentielRoute } from "./routes/referentiel/getReferentiel";
import { createTransactionRoute } from "./routes/transaction/createTransaction";
import { deleteTransactionRoute } from "./routes/transaction/deleteTransaction";
import { getTransactionsRoute } from "./routes/transaction/getTransactions";
import { getFundsRoute } from "./routes/fund/getFunds";
import { createFundRoute } from "./routes/fund/createFund";
import { deleteFundRoute } from "./routes/fund/deleteFund";
import {Actions} from "Shared/RouteType";

/**
 * Registre de toutes les routes de l'application
 * 
 * Chaque route est définie dans son propre fichier sous ./routes/
 */
const routes = {
   [Actions.map.authAction]: authRoute,
   [Actions.map.getReferentielAction]: getReferentielRoute,
   [Actions.map.getHistoryAction]: getHistoryRoute,
   [Actions.map.createReferentielAction]: createReferentielRoute,
   [Actions.map.deleteReferentielAction]: deleteReferentielRoute,
   [Actions.map.getTransactionsAction]: getTransactionsRoute,
   [Actions.map.createTransactionAction]: createTransactionRoute,
   [Actions.map.deleteTransactionAction]: deleteTransactionRoute,
   [Actions.map.getFundsAction]: getFundsRoute,
   [Actions.map.createFundAction]: createFundRoute,
   [Actions.map.deleteFundAction]: deleteFundRoute,
} satisfies PostRouteRegistry<Actions.Type>;

/**
 * Instance du router ProcessRouter
 * 
 * Utilisez cette instance dans votre fonction doPost :
 * ```typescript
 * import { router } from './config/route/route';
 * 
 * function doPost(e: GoogleAppsScript.Events.DoPost) {
 *     return router(e);
 * }
 * ```
 */
export const router = createProcessRouter({ postRoutes: routes });
