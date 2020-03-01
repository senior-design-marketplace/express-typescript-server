import { ClassOptions, ClassWrapper, Controller, Middleware, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import InviteService from "../../service/InviteService";
import { RequiresAdministrator, RequiresSelf, Verified } from "../middlewares";

@ClassWrapper(AsyncHandler)
@ClassOptions({ mergeParams: true })
@Controller("projects/:project/invites")
export default class InviteController {
    constructor(private readonly inviteService: InviteService) {}

    @Post()
    @Middleware([ RequiresAdministrator('project'), Verified('InviteImmutable') ])
    public async inviteProjectMember(req: Request, res: Response) {
        const result = await this.inviteService.inviteProjectMember({
            payload: req.verified,
            claims: req.claims,
            resourceId: req.params.project
        })

        res.status(200).json(result);
    }

    @Post(":invite")
    @Middleware([ RequiresSelf('invite'), Verified('Response') ])
    public async inviteReply(req: Request, res: Response) {
        const result = await this.inviteService.inviteReply({
            payload: req.verified,
            claims: req.claims,
            outerResourceId: req.params.project,
            innerResourceId: req.params.invite
        })

        res.status(200).json(result);
    }
}
