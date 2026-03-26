import { createRoute } from "MypkgAppsScript/ProcessRouter";
import { Validator as V, ContextType as CT, ResponseType as RT } from "Shared/RouteType";
import {defaultStartProcess} from "./defaultStartProcess";


/**
 * Logique métier pour la route auth
 * Utilise le middleware d'authentification pour vérifier le token
 */
const authProcess = defaultStartProcess<CT.AuthAction>()
    // Si on arrive ici, l'authentification a réussi
    .result((ctx) => ({
        message: "Authentifié avec succès"
    }));

const authLogic = (
    e: GoogleAppsScript.Events.DoPost,
    contents: CT.AuthAction
) => {
    return authProcess.execute({ e, contents });
};

/**
 * Route d'authentification
 */
export const authRoute = createRoute<RT.AuthAction>()({
    contentsValidator: V.authAction,
    routeLogic: authLogic
});
