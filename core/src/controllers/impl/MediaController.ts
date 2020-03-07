import { ClassOptions, ClassWrapper, Controller, Middleware, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import { MediaRequestFactory } from "../mediaRequestFactory";
import { RequiresContributor, RequiresSelf, Verified } from '../middlewares';

@ClassWrapper(AsyncHandler)
@ClassOptions({ mergeParams: true })
@Controller("")
export default class MediaController {

    constructor(private readonly requestFactory: MediaRequestFactory) {}

    @Post("users/:user/avatar")
    @Middleware([ RequiresSelf('user'), Verified('ImageMediaImmutable') ])
    public async newAvatar(req: Request, res: Response) {
        const result = await this.requestFactory.knownFileRequest({
            bucket: 'marqetplace-staging-photos',
            key: `users/${req.params.user}/avatar`,
            type: req.verified.type
        })
        
        res.status(200).json(result);
    }

    @Post("projects/:project/cover")
    @Middleware([ RequiresContributor('project'), Verified('ImageMediaImmutable') ])
    public async newProjectCover(req: Request, res: Response) {
        const result = await this.requestFactory.knownFileRequest({
            bucket: 'marqetplace-staging-photos',
            key: `projects/${req.params.project}/cover`,
            type: req.verified.type
        })

        res.status(200).json(result);
    }

    @Post("projects/:project/thumbnail")
    @Middleware([ RequiresContributor('project'), Verified('ImageMediaImmutable') ])
    public async newProjectThumbnail(req: Request, res: Response) {
        const result = await this.requestFactory.knownFileRequest({
            bucket: 'marqetplace-staging-photos',
            key: `projects/${req.params.project}/thumbnail`,
            type: req.verified.type
        })

        res.status(200).json(result);
    }

    @Post("projects/:project/board/:entry")
    @Middleware([ RequiresContributor('project'), Verified('BoardMediaImmutable') ])
    public async newProjectBoardMedia(req: Request, res: Response) {
        const result = await this.requestFactory.knownFileRequest({
            bucket: 'marqetplace-staging-photos',
            key: `projects/${req.params.project}/board/${req.params.entry}`,
            type: req.verified.type
        })

        res.status(200).json(result);
    }
}