import {StartProcess } from "MypkgAppsScript/ProcessRouter";
import { authMiddleware } from "../../middleware/auth/auth";
import { ContextType as CT} from "Shared/RouteType";

export const defaultStartProcess =
    StartProcess<CT.GetReferentielAction>()
    .do(authMiddleware)
