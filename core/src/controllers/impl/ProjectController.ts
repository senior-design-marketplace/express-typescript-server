import { ClassOptions, ClassWrapper, Controller, Delete, Get, Middleware, Patch, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import pick from 'lodash/pick';
import { keys } from "ts-transformer-keys";
import { ProjectMaster } from "../../schemas/types/Project/ProjectMaster";
import { FilterParams } from "../../schemas/types/QueryParams/FilterParams";
import { SortParams } from "../../schemas/types/QueryParams/SortParams";
import ProjectService from '../../service/ProjectService';
import { RequiresAdministrator, RequiresAuth, RequiresContributor, RespondsToAuth, Verified } from "../middlewares";
import { extractValue, PassThrough } from "./util";

@ClassWrapper(AsyncHandler)
@ClassOptions({ mergeParams: true })
@Controller("projects")
export default class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

	@Get()
	@Middleware([ Verified("QueryParams", true) ])
	public async getProjects(req: Request, res: Response) {
		const filterParams: FilterParams = pick(
            req.verified, 
            ...keys<FilterParams>()
        );

        const sortParams: SortParams = pick(
            req.verified,
            ...keys<SortParams>()
        );

        const result = await this.projectService.describeProjects({
            filterParams, 
            sortParams
        });

		res.status(200).json(result);
	}

	@Post()
	@Middleware([ RequiresAuth, Verified("ProjectImmutable") ])
	public async newProject(req: Request, res: Response) {
        const result = await this.projectService.createProject({
            payload: req.verified,
            claims: req.claims
        })

        res.status(200).json(result);
	}

    @Get(":project")
    @Middleware([ RespondsToAuth ])
	public async getProjectById(req: Request, res: Response) {
        const result = await this.projectService.describeProject({
            payload: null,
            resourceId: req.params.project
        });

        // additional fields mapped by this controller
        const additional: { starredByUser?: boolean, popularity?: number } & Partial<ProjectMaster> = {}
        if (req.claims) {
            additional.starredByUser = result.starredBy.some((user) => {
                user.id === req.claims.username;
            })

            if (result.administrators.map(instance => instance.id).includes(req.claims.username)) {
                additional.applications = result.applications
            }
        }

        additional.popularity = result.starredBy.length;

        res.status(200).json({
            ...pick(result, keys<PassThrough<ProjectMaster, 'administrators' | 'contributors' | 'boardItems'>>()),
            ...additional,
            tags: extractValue(result.tags),
            requestedMajors: extractValue(result.tags)
        });
	}

    @Patch(":project")
    @Middleware([ RequiresContributor('project'), Verified("ProjectMutable") ])
	public async updateProject(req: Request, res: Response) {
        const result = await this.projectService.updateProject({
            payload: req.verified,
            resourceId: req.params.project,
            claims: req.claims
        })

		res.status(200).json(result);
	}

	@Delete(":project")
	@Middleware([ RequiresAdministrator('project') ])
	public async deleteProject(req: Request, res: Response) {
		const result = await this.projectService.deleteProject({
            payload: null,
            resourceId: req.params.project,
            claims: req.claims
        });

		res.status(200).json(result);
    }
}
