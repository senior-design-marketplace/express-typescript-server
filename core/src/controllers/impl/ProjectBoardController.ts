import { ClassOptions, ClassWrapper, Controller, Delete, Middleware, Patch, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import { RequiresAuth, VerifyBody, VerifyPath } from '../middlewares';
import { isUUID } from 'validator';
import { EnforcerService } from "../../../../external/enforcer/src/EnforcerService";

@ClassWrapper(AsyncHandler)
@ClassOptions({ mergeParams: true })
@Controller("projects/:project/board")
export default class ProjectBoardController {

	constructor(private enforcerService: EnforcerService) {}

    @Post()
    @Middleware([ 
        RequiresAuth,
        VerifyBody('CreateBoardEntry'), 
        VerifyPath('project', isUUID) ])
    public async createBoardEntry(req: Request, res: Response) {
        const result = await this.enforcerService.createEntry({
            payload: req.body,
            claims: req.claims,
            resourceIds: [ req.params.project ]
        });

        res.status(200).json(result);
    }

    @Patch(":entry")
    @Middleware([ 
        RequiresAuth,
        VerifyBody('UpdateBoardEntry'), 
        VerifyPath('project', isUUID), 
        VerifyPath('entry', isUUID) ])
    public async updateBoardEntry(req: Request, res: Response) {
        const result = await this.enforcerService.updateEntry({
            payload: req.body,
            claims: req.claims,
            resourceIds: [ req.params.project, req.params.entry ]
        });

        res.status(200).json(result);
    }

    @Delete(":entry")
    @Middleware([ 
        RequiresAuth,
        VerifyPath('project', isUUID), 
        VerifyPath('entry', isUUID) ])
    public async deleteBoardEntry(req: Request, res: Response) {
        const result = await this.enforcerService.deleteEntry({
            payload: null,
            claims: req.claims,
            resourceIds: [ req.params.project, req.params.entry ]
        });

        res.status(200).json(result);
    }
}