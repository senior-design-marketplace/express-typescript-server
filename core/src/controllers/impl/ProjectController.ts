import { ClassOptions, ClassWrapper, Controller, Delete, Get, Middleware, Patch, Post, Put } from "@overnightjs/core";
import { Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import { RequiresAuth, RespondsToAuth, VerifyBody, VerifyPath } from "../middlewares";
import { isUUID } from 'validator';
import { applyTransformation } from "../transformers";
import { EnforcerService } from "../../../../external/enforcer/src/EnforcerService";

@ClassWrapper(AsyncHandler)
@ClassOptions({ mergeParams: true })
@Controller("projects")
export default class ProjectController {

    constructor(private enforcerService: EnforcerService) {}

	@Get()
	public async getProjects(req: Request, res: Response) {
        const result = await this.enforcerService.listProjects(
            {
                payload: req.query,
                claims: req.claims,
                resourceIds: [],
            },
            {
                noRelations: true
            }
        );

        res.status(200).json(applyTransformation(result));
	}

	@Post()
	@Middleware([ 
        RequiresAuth, 
        VerifyBody("CreateProject") ])
	public async newProject(req: Request, res: Response) {
        const result = await this.enforcerService.createProject({
            payload: req.body,
            claims: req.claims,
            resourceIds: []
        });

        res.status(200).json(result);
	}

    @Get(":project")
    @Middleware([ 
        RespondsToAuth, 
        VerifyPath('project', isUUID) ])
	public async getProjectById(req: Request, res: Response) {
        const result = await this.enforcerService.describeProject({
            payload: {},
            claims: req.claims,
            resourceIds: [ req.params.project ]
        });

        res.status(200).json(applyTransformation(result));
    }

    @Patch(":project")
    @Middleware([ 
        RequiresAuth,
        VerifyBody("UpdateProject"), 
        VerifyPath('project', isUUID) ])
	public async updateProject(req: Request, res: Response) {
        const result = await this.enforcerService.updateProject({
            payload: req.body,
            claims: req.claims,
            resourceIds: [ req.params.project ],
        })

		res.status(200).json(result);
    }
    
	@Delete(":project")
	@Middleware([ 
        RequiresAuth, 
        VerifyPath('project', isUUID) ])
	public async deleteProject(req: Request, res: Response) {
		const result = await this.enforcerService.deleteProject({
            payload: {},
            claims: req.claims,
            resourceIds: [ req.params.project ]
        });

		res.status(200).json(result);
    }

    @Patch(":project/members/:member")
    @Middleware([
        RequiresAuth,
        VerifyBody("UpdateMember"),
        VerifyPath('project', isUUID)
    ])
    public async updateMember(req: Request, res: Response) {
        const result = await this.enforcerService.updateProjectMember({
            payload: req.body,
            claims: req.claims,
            resourceIds: [ req.params.project, req.params.member ]
        })

        res.status(200).json(result);
    }

    @Delete(":project/members/:member")
    @Middleware([
        RequiresAuth,
        VerifyPath('project', isUUID)
    ])
    public async deleteMember(req: Request, res: Response) {
        const result = await this.enforcerService.deleteProjectMember({
            payload: {},
            claims: req.claims,
            resourceIds: [ req.params.project, req.params.member ]
        })

        res.status(200).json(result);
    }

    @Put(":project/majors")
    @Middleware([
        RequiresAuth,
        VerifyBody("UpdateMajors"),
        VerifyPath('project', isUUID),
    ])
    public async updateProjectMajors(req: Request, res: Response) {
        const result = await this.enforcerService.updateMajors({
            payload: req.body,
            claims: req.claims,
            resourceIds: [ req.params.project ]
        })

        res.status(200).json(result);
    }

    @Put(":project/tags")
    @Middleware([
        RequiresAuth,
        VerifyBody("UpdateTags"),
        VerifyPath('project', isUUID)
    ])
    public async updateProjectTags(req: Request, res: Response) {
        const result = await this.enforcerService.updateTags({
            payload: req.body,
            claims: req.claims,
            resourceIds: [ req.params.project ]
        })

        res.status(200).json(result);
    }
}
