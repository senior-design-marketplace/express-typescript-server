import { ClassOptions, ClassWrapper, Controller, Middleware, Post, Delete, Patch } from "@overnightjs/core";
import { Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import { RequiresAuth, VerifyBody, VerifyPath } from "../middlewares";
import { isUUID } from 'validator';
import { EnforcerService } from "../../../../external/enforcer/src/EnforcerService";

@ClassWrapper(AsyncHandler)
@ClassOptions({ mergeParams: true })
@Controller("projects/:project/comments")
export default class CommentController {
    constructor(private readonly enforcerService: EnforcerService) {}

    @Post()
    @Middleware([ 
        RequiresAuth, 
        VerifyBody("CreateComment"), 
        VerifyPath('project', isUUID) ])
    public async createComment(req: Request, res: Response) {
        const result = await this.enforcerService.createComment({
            payload: req.body,
            claims: req.claims,
            resourceIds: [ req.params.project ],
        });

        res.status(200).json(result);
    }

    @Post(":comment")
    @Middleware([ 
        RequiresAuth, 
        VerifyBody("CreateComment"), 
        VerifyPath('project', isUUID), 
        VerifyPath('comment', isUUID) ])
    public async replyComment(req: Request, res: Response) {
        const result = await this.enforcerService.replyComment({
            payload: req.body,
            claims: req.claims,
            resourceIds: [ req.params.project, req.params.comment ]
        });

        res.status(200).json(result);
    }

    @Patch(":comment")
    @Middleware([
        RequiresAuth,
        VerifyBody("UpdateComment"),
        VerifyPath('project', isUUID),
        VerifyPath('comment', isUUID)
    ])
    public async updateComment(req: Request, res: Response) {
        const result = await this.enforcerService.updateComment({
            payload: req.body,
            claims: req.claims,
            resourceIds: [ req.params.project, req.params.comment ]
        });

        res.status(200).json(result);
    }

    @Delete(":comment")
    @Middleware([
        RequiresAuth,
        VerifyPath('project', isUUID),
        VerifyPath('comment', isUUID)
    ])
    public async deleteComment(req: Request, res: Response) {
        const result = await this.enforcerService.deleteComment({
            payload: {},
            claims: req.claims,
            resourceIds: [ req.params.project, req.params.comment ]
        });

        res.status(200).json(result);
    }
}
