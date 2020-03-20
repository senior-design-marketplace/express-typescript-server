import { ClassOptions, ClassWrapper, Controller, Middleware, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import { isUUID } from 'validator';
import { RequiresAuth, VerifyBody, VerifyPath } from '../middlewares';
import { EnforcerService } from "../../../../external/enforcer/src/EnforcerService";

@ClassWrapper(AsyncHandler)
@ClassOptions({ mergeParams: true })
@Controller("")
export default class MediaController {

    constructor(private readonly enforcerService: EnforcerService) {}

    @Post("users/:user/avatar")
    @Middleware([ 
        RequiresAuth,
        VerifyBody('CreateImageMedia') ])
    public async newAvatar(req: Request, res: Response) {
        const result = await this.enforcerService.updateUserAvatar({
            payload: req.body,
            claims: req.claims,
            resourceIds: [ req.params.user ]
        });
        
        res.status(200).json(result);
    }

    @Post("projects/:project/cover")
    @Middleware([ 
        RequiresAuth,
        VerifyBody('CreateImageMedia'), 
        VerifyPath('project', isUUID) ])
    public async newProjectCover(req: Request, res: Response) {
        const result = await this.enforcerService.updateProjectCover({
            payload: req.body,
            claims: req.claims,
            resourceIds: [ req.params.project ],
        });

        res.status(200).json(result);
    }

    @Post("projects/:project/thumbnail")
    @Middleware([ 
        RequiresAuth, 
        VerifyBody('CreateImageMedia'), 
        VerifyPath('project', isUUID) ])
    public async newProjectThumbnail(req: Request, res: Response) {
        const result = await this.enforcerService.updateProjectThumbnail({
            payload: req.body,
            claims: req.claims,
            resourceIds: [ req.params.project ]
        });

        res.status(200).json(result);
    }

    @Post("projects/:project/board/:entry")
    @Middleware([ 
        RequiresAuth,
        VerifyBody('CreateBoardMedia'), 
        VerifyPath('project', isUUID), 
        VerifyPath('entry', isUUID) ])
    public async newProjectBoardMedia(req: Request, res: Response) {
        const result = await this.enforcerService.updateProjectEntryMedia({
            payload: req.body,
            claims: req.claims,
            resourceIds: [ req.params.project, req.params.entry ]
        });

        res.status(200).json(result);
    }
}