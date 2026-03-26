import { createProcessRouter, type PostRouteRegistry } from "MypkgAppsScript/ProcessRouter";
import { authRoute } from "./routes/auth";
import { getReferentielRoute } from "./routes/referentiel/getReferentiel";
import {Actions} from "Shared/RouteType";

/**
 * Registre de toutes les routes de l'application
 * 
 * Chaque route est définie dans son propre fichier sous ./routes/
 */
const routes = {
   [Actions.map.authAction]: authRoute,
   [Actions.map.getReferentielAction]: getReferentielRoute,
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
