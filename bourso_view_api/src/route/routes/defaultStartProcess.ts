import {StartProcess } from "MypkgAppsScript/ProcessRouter";
import { authMiddleware } from "../../middleware/auth/auth";


type AuthenticatedContext = {
    authToken: string;
};

export const defaultStartProcess = <TContext extends AuthenticatedContext>() =>
    StartProcess<TContext>()
        .do(authMiddleware);
