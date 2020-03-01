import { ClassOptions, ClassWrapper, Controller, Get, Middleware, Patch } from "@overnightjs/core";
import { Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import { RequiresSelf, Verified } from '../middlewares';
import UserService from '../../service/UserService';

@ClassWrapper(AsyncHandler)
@ClassOptions({ mergeParams: true })
@Controller("users")
export default class UserController {
    constructor(private readonly service: UserService) {}

    @Get(":user")
    public async describeUser(req: Request, res: Response) {
        return this.service.describeUser({
            payload: null,
            resourceId: req.params.user
        })
    }

    @Patch(":user")
    @Middleware([ RequiresSelf('user'), Verified('UserMutable') ])
    public async updateUser(req: Request, res: Response) {
        return this.service.updateUser({
            payload: req.verified,
            resourceId: req.params.user,
            claims: req.claims
        })
    }
}