import { ClassOptions, ClassWrapper, Controller, Delete, Middleware, Patch, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import ProjectBoardService from "../../service/ProjectBoardService";
import { RequiresAuth, VerifyBody, VerifyPath } from '../middlewares';
import { isUUID } from 'validator';

@ClassWrapper(AsyncHandler)
@ClassOptions({ mergeParams: true })
@Controller("projects/:project/board")
export default class ProjectBoardController {
	constructor(private readonly service: ProjectBoardService) {}

    @Post()
    @Middleware([ 
        RequiresAuth,
        VerifyBody('BoardEntryImmutable'), 
        VerifyPath('project', isUUID) ])
    public async createBoardEntry(req: Request, res: Response) {
        const result = await this.service.createBoardEntry({
            payload: req.verified,
            resourceId: req.params.project,
            claims: req.claims
        })

        res.status(200).json(result);
    }

    @Patch(":entry")
    @Middleware([ 
        RequiresAuth,
        VerifyBody('BoardEntryMutable'), 
        VerifyPath('project', isUUID), 
        VerifyPath('entry', isUUID) ])
    public async updateBoardEntry(req: Request, res: Response) {
        const result = await this.service.updateBoardEntry({
            payload: req.verified,
            outerResourceId: req.params.project,
            innerResourceId: req.params.entry,
            claims: req.claims
        })

        res.status(200).json(result);
    }

    @Delete(":entry")
    @Middleware([ 
        RequiresAuth,
        VerifyPath('project', isUUID), 
        VerifyPath('entry', isUUID) ])
    public async deleteBoardEntry(req: Request, res: Response) {
        const result = await this.service.deleteBoardEntry({
            payload: null,
            outerResourceId: req.params.project,
            innerResourceId: req.params.entry,
            claims: req.claims
        })

        res.status(200).json(result);
    }
}