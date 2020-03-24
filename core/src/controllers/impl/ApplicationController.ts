import { ClassOptions, ClassWrapper, Controller, Middleware, Patch, Post, Delete } from "@overnightjs/core";
import { Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import { RequiresAuth, VerifyBody, VerifyPath } from "../middlewares";
import { isUUID } from 'validator';
import { EnforcerService } from "../../../../external/enforcer/src/EnforcerService";

@ClassWrapper(AsyncHandler)
@ClassOptions({ mergeParams: true })
@Controller("projects/:project/applications")
export default class ApplicationController {

    constructor(private enforcerService: EnforcerService) {}

    @Post()
    @Middleware([ 
        RequiresAuth, 
        VerifyBody("CreateApplication"), 
        VerifyPath('project', isUUID) ])
    public async createProjectApplication(req: Request, res: Response) {
        const result = await this.enforcerService.createApplication({
            payload: req.body,
            claims: req.claims,
            resourceIds: [ req.params.project ],
        });

        res.status(200).json(result);
    }

    @Patch(":application")
    @Middleware([ 
        RequiresAuth,
        VerifyBody("CreateResponse"), 
        VerifyPath('project', isUUID), 
        VerifyPath('application', isUUID)])
    public async replyProjectApplication(req: Request, res: Response) {
        const result = await this.enforcerService.replyApplication({
            payload: req.body,
            claims: req.claims,
            resourceIds: [ req.params.project, req.params.application ]
        });

        res.status(200).json(result);
    }

    @Delete(":application")
    @Middleware([
        RequiresAuth,
        VerifyPath('project', isUUID),
        VerifyPath('application', isUUID)
    ])
    public async deleteApplication(req: Request, res: Response) {
        const result = await this.enforcerService.deleteApplication({
            payload: {},
            claims: req.claims,
            resourceIds: [ req.params.project, req.params.application ]
        });

        res.status(200).json(result);
    }
}
