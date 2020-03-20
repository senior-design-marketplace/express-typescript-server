import { ClassOptions, ClassWrapper, Controller, Get, Middleware, Patch } from "@overnightjs/core";
import { Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import { RequiresAuth, VerifyBody, VerifyPath } from '../middlewares';
import { isUUID } from 'validator';
import { EnforcerService } from "../../../../external/enforcer/src/EnforcerService";

@ClassWrapper(AsyncHandler)
@ClassOptions({ mergeParams: true })
@Controller("users")
export default class UserController {

    constructor(private enforcerService: EnforcerService) {}

    @Get(":user")
    public async describeUser(req: Request, res: Response) {
        const result = await this.enforcerService.describeUser({
            payload: {},
            claims: req.claims,
            resourceIds: [ req.params.user ]
        });

        res.status(200).json(result);
    }

    @Patch(":user")
    @Middleware([ 
        RequiresAuth,
        VerifyBody('UpdateUser') ])
    public async updateUser(req: Request, res: Response) {
        const result = await this.enforcerService.updateUser({
            payload: req.body,
            claims: req.claims,
            resourceIds: [ req.params.user ]
        });

        res.status(200).json(result);
    }

    @Patch(":user/notifications/:notification")
    @Middleware([
        RequiresAuth,
        VerifyPath('notification', isUUID),
        VerifyBody('UpdateNotification') ])
    public async updateNotificationAsRead(req: Request, res: Response) {
        const result = await this.enforcerService.updateNotification({
            payload: req.body,
            claims: req.claims,
            resourceIds: [ req.params.user, req.params.notification ]
        });

        res.status(200).json(result);
    }
}