import { Controller, Middleware, Get, Post, Patch, Delete, ClassWrapper, Wrapper } from "@overnightjs/core";
import { Request, Response } from "express";
import { RequiresAuth } from "../middlewares";
import { Verified } from "../middlewares";
import { OK } from "http-status-codes";
import { Access } from "../../access/dao";
import asyncHandler from "express-async-handler";
import { FilterParams, SortParams } from "../../schemas/build/queryParams/type";
import { keys } from "ts-transformer-keys";
import _ from 'lodash';

@ClassWrapper(asyncHandler)
@Controller("projects")
export default class ProjectsController {
	constructor(private readonly repository: Access.Repository) {}

	@Get()
	@Middleware([Verified("QueryParams", true)])
	public async getProjects(req: Request, res: Response) {
		const filters: FilterParams = _.pick(
            req.verified, 
            ...keys<FilterParams>()
        );

        const sorts: SortParams = _.pick(
            req.verified,
            ...keys<SortParams>()
        );

		const projects = await this.repository.getProjectStubs(filters, sorts);
		res.status(OK).json(projects);
	}

	@Post()
	@Middleware([RequiresAuth, Verified("ProjectImmutable")])
	public async newProject(req: Request, res: Response) {
        await this.repository.createProject(req.verified);
		res.sendStatus(OK);
	}

	@Get(":id")
	public async getProjectById(req: Request, res: Response) {
		const output = await this.repository.getProjectDetails(req.params.id);
		res.status(OK).json(output);
	}

    @Patch(":id")
    @Middleware([RequiresAuth, Verified("ProjectMutable")])
	public async updateProject(req: Request, res: Response) {
        await this.repository.updateProject(req.params.id, req.verified);
		res.sendStatus(OK);
	}

	@Delete(":id")
	@Middleware([RequiresAuth])
	public async deleteProject(req: Request, res: Response) {
		const output = await this.repository.getProjectDetails(req.params.id);
		//TODO: check that the user is an admin on this project, if not throw a 401.

		await this.repository.deleteProject(req.params.id);
		res.sendStatus(OK);
	}
}
