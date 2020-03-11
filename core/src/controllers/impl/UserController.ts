import { ClassOptions, ClassWrapper, Controller, Get, Middleware, Patch } from "@overnightjs/core";
import { Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import { RequiresSelf, VerifyBody, VerifyPath } from '../middlewares';
import UserService from '../../service/UserService';
import { isUUID } from 'validator';

@ClassWrapper(AsyncHandler)
@ClassOptions({ mergeParams: true })
@Controller("users")
export default class UserController {
    constructor(private readonly service: UserService) {}

    @Get(":user")
    public async describeUser(req: Request, res: Response) {
        const result = await this.service.describeUser({
            payload: null,
            resourceId: req.params.user
        })

        res.status(200).json(result);
    }

    @Patch(":user")
    @Middleware([ 
        RequiresSelf('user'), 
        VerifyBody('UserMutable') ])
    public async updateUser(req: Request, res: Response) {
        const result = await this.service.updateUser({
            payload: req.verified,
            resourceId: req.params.user,
            claims: req.claims
        })

        res.status(200).json(result);
    }

    //TODO: must compound the key on the data layer, otherwise is unsafe
    @Patch(":user/notifications/:notification")
    @Middleware([
        RequiresSelf('user'),
        VerifyPath('notification', isUUID),
        VerifyBody('NotificationMutable') ])
    public async updateNotificationAsRead(req: Request, res: Response) {
        const result = await this.service.updateNotificationAsRead({
            payload: req.verified,
            outerResourceId: req.params.user,
            innerResourceId: req.params.notification,
            claims: req.claims
        })

        res.status(200).json(result);
    }
}