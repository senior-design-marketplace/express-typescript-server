import { ClassOptions, ClassWrapper, Controller, Middleware, Post, Delete } from "@overnightjs/core";
import { Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import { RequiresAuth, VerifyBody, VerifyPath } from "../middlewares";
import { isUUID } from 'validator';
import { EnforcerService } from "../../../../external/enforcer/src/EnforcerService";

@ClassWrapper(AsyncHandler)
@ClassOptions({ mergeParams: true })
@Controller("projects/:project/invites")
export default class InviteController {

    constructor(private readonly enforcerService: EnforcerService) {}

    @Post()
    @Middleware([ 
        RequiresAuth,
        VerifyBody('CreateInvite'), 
        VerifyPath('project', isUUID) ])
    public async inviteProjectMember(req: Request, res: Response) {
        const result = await this.enforcerService.createInvite({
            payload: req.body,
            claims: req.claims,
            resourceIds: [ req.params.project ]
        });

        res.status(200).json(result);
    }

    @Post(":invite")
    @Middleware([ 
        RequiresAuth,
        VerifyBody('CreateResponse'), 
        VerifyPath('project', isUUID), 
        VerifyPath('invite', isUUID) ])
    public async inviteReply(req: Request, res: Response) {
        const result = await this.enforcerService.replyInvite({
            payload: req.body,
            claims: req.claims,
            resourceIds: [ req.params.project, req.params.invite ]
        });

        res.status(200).json(result);
    }

    @Delete(":invite")
    @Middleware([
        RequiresAuth,
        VerifyPath('project', isUUID),
        VerifyPath('invite', isUUID)
    ])
    public async deleteInvite(req: Request, res: Response) {
        const result = await this.enforcerService.deleteInvite({
            payload: {},
            claims: req.claims,
            resourceIds: [ req.params.project, req.params.invite ]
        });

        res.status(200).json(result);
    }
}
