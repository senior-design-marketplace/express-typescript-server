import { ClassOptions, ClassWrapper, Controller, Middleware, Patch, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import ApplicationService from "../../service/ApplicationService";
import { RequiresAdministrator, RequiresAuth, VerifyBody, VerifyPath } from "../middlewares";
import { isUUID } from 'validator';

@ClassWrapper(AsyncHandler)
@ClassOptions({ mergeParams: true })
@Controller("projects/:project/applications")
export default class ApplicationController {
    constructor(private readonly service: ApplicationService) {}

    @Post()
    @Middleware([ 
        RequiresAuth, 
        VerifyBody("ApplicationImmutable"), 
        VerifyPath('project', isUUID) ])
    public async createProjectApplication(req: Request, res: Response) {
        const result = await this.service.createProjectApplication({
            payload: req.verified,
            resourceId: req.params.project,
            claims: req.claims
        })

        res.status(200).json(result);
    }

    @Patch(":application")
    @Middleware([ 
        RequiresAdministrator("project"), 
        VerifyBody("Response"), 
        VerifyPath('project', isUUID), 
        VerifyPath('application', isUUID)])
    public async replyProjectApplication(req: Request, res: Response) {
        const result = await this.service.replyProjectApplication({
            payload: req.verified,
            outerResourceId: req.params.project,
            innerResourceId: req.params.application,
            claims: req.claims
        });

        res.status(200).json(result);
    }
}
