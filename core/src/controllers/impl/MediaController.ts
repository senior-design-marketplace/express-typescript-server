import { ClassOptions, ClassWrapper, Controller, Middleware, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import { MediaRequestFactory } from "../mediaRequestFactory";
import { RequiresContributor, RequiresSelf } from '../middlewares';

@ClassWrapper(AsyncHandler)
@ClassOptions({ mergeParams: true })
@Controller("")
export default class MediaController {
    constructor(private readonly requestFactory: MediaRequestFactory) {}

    @Post("users/:user/avatar")
    @Middleware([ RequiresSelf('user') ])
    public async newAvatar(req: Request, res: Response) {
        const result = this.requestFactory.knownFileRequest({
            bucket: 'marqetplace-staging-photos',
            key: `users/${req.params.user}/avatar`
        })
        
        res.status(200).json(result);
    }

    @Post("projects/:project/cover")
    @Middleware([ RequiresContributor('project') ])
    public async newProjectCover(req: Request, res: Response) {
        const result = this.requestFactory.knownFileRequest({
            bucket: 'marqetplace-staging-photos',
            key: `projects/${req.params.project}/cover`
        })

        res.status(200).json(result);
    }

    @Post("projects/:project/thumbnail")
    @Middleware([ RequiresContributor('project') ])
    public async newProjectThumbnail(req: Request, res: Response) {
        const result = this.requestFactory.knownFileRequest({
            bucket: 'marqetplace-staging-photos',
            key: `projects/${req.params.project}/thumbnail`
        })

        res.status(200).json(result);
    }

    @Post("projects/:project/board/:entry")
    @Middleware([ RequiresContributor('project') ])
    public async newProjectBoardMedia(req: Request, res: Response) {
        const result = this.requestFactory.knownFileRequest({
            bucket: 'marqetplace-staging-photos',
            key: `projects/${req.params.project}/board/${req.params.entry}`
        })

        res.status(200).json(result);
    }
}