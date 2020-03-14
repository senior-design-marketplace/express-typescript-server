import { ClassOptions, ClassWrapper, Controller, Middleware, Patch, Post, Delete } from "@overnightjs/core";
import { Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import { RequiresAuth, VerifyBody, VerifyPath } from "../middlewares";
import CommentService from "../../service/CommentService";
import { isUUID } from 'validator';
import { TranslateErrors } from "../../service/decorators";
import { PolicyApplicationFailedError } from "../../service/enforcer/EnforcerService";
import { AuthorizationError } from "../../error/error";

@ClassWrapper(AsyncHandler)
@ClassOptions({ mergeParams: true })
@Controller("projects/:project/comments")
export default class CommentController {
    constructor(private readonly service: CommentService) {}

    @Post()
    @Middleware([ 
        RequiresAuth, 
        VerifyBody("CommentImmutable"), 
        VerifyPath('project', isUUID) ])
    public async createComment(req: Request, res: Response) {
        const result = await this.service.createComment({
            payload: req.verified,
            resourceId: req.params.project,
            claims: req.claims
        })

        res.status(200).json(result);
    }

    @Post(":comment")
    @Middleware([ 
        RequiresAuth, 
        VerifyBody("CommentImmutable"), 
        VerifyPath('project', isUUID), 
        VerifyPath('comment', isUUID) ])
    public async replyComment(req: Request, res: Response) {
        const result = await this.service.replyComment({
            payload: req.verified,
            outerResourceId: req.params.project,
            innerResourceId: req.params.comment,
            claims: req.claims
        });

        res.status(200).json(result);
    }

    @Delete(":comment")
    @Middleware([
        RequiresAuth,
        VerifyPath('project', isUUID),
        VerifyPath('comment', isUUID)
    ])
    @TranslateErrors([ PolicyApplicationFailedError ], AuthorizationError)
    public async deleteComment(req: Request, res: Response) {
        const result = await this.service.deleteComment({
            payload: null,
            outerResourceId: req.params.project,
            innerResourceId: req.params.comment,
            claims: req.claims
        })

        res.status(200).json(result);
    }
}
