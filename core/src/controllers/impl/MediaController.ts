import { ClassOptions, ClassWrapper, Controller, Middleware, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import { isUUID } from 'validator';
import { MediaService } from "../../service/MediaService";
import { RequiresAuth, VerifyBody, VerifyPath } from '../middlewares';

@ClassWrapper(AsyncHandler)
@ClassOptions({ mergeParams: true })
@Controller("")
export default class MediaController {

    constructor(private readonly service: MediaService) {}

    @Post("users/:user/avatar")
    @Middleware([ 
        RequiresAuth,
        VerifyBody('ImageMediaImmutable') ])
    public async newAvatar(req: Request, res: Response) {
        const result = await this.service.updateAvatar({
            payload: req.verified,
            resourceId: req.params.user,
            claims: req.claims
        })
        
        res.status(200).json(result);
    }

    @Post("projects/:project/cover")
    @Middleware([ 
        RequiresAuth,
        VerifyBody('ImageMediaImmutable'), 
        VerifyPath('project', isUUID) ])
    public async newProjectCover(req: Request, res: Response) {
        const result = await this.service.updateCover({
            payload: req.verified,
            resourceId: req.params.project,
            claims: req.claims
        })

        res.status(200).json(result);
    }

    @Post("projects/:project/thumbnail")
    @Middleware([ 
        RequiresAuth, 
        VerifyBody('ImageMediaImmutable'), 
        VerifyPath('project', isUUID) ])
    public async newProjectThumbnail(req: Request, res: Response) {
        const result = await this.service.updateThumbnail({
            payload: req.verified,
            resourceId: req.params.project,
            claims: req.claims
        })

        res.status(200).json(result);
    }

    @Post("projects/:project/board/:entry")
    @Middleware([ 
        RequiresAuth,
        VerifyBody('BoardMediaImmutable'), 
        VerifyPath('project', isUUID), 
        VerifyPath('entry', isUUID) ])
    public async newProjectBoardMedia(req: Request, res: Response) {
        const result = await this.service.updateBoardMedia({
            payload: req.verified,
            outerResourceId: req.params.project,
            innerResourceId: req.params.entry,
            claims: req.claims
        })

        res.status(200).json(result);
    }
}