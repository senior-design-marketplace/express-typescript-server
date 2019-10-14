import {
	Controller,
	Middleware,
	Get,
	Post,
	Put,
	Delete,
	ClassWrapper,
	Wrapper
} from "@overnightjs/core";
import { Request, Response } from "express";
import { RequiresAuth } from "../middlewares";
import { Verified } from "../middlewares";
import { OK } from "http-status-codes";
import { Access } from "../../access/dao";
import asyncHandler from "express-async-handler";
import { FilterParams, SortParams } from "../../schemas/build/queryParams";

@ClassWrapper(asyncHandler)
@Controller("projects")
export default class ProjectsController {
	constructor(private readonly repository: Access.Repository) {}

	@Get()
	@Middleware([Verified("queryParams", true)])
	public async getProjects(req: Request, res: Response) {
		//separate the query parameters into filters and sorts
		const filters: FilterParams = (({
			tag,
			advisor_id,
			has_advisor,
			requested_major,
			accepting_applications
		}) => ({
			tag,
			advisor_id,
			has_advisor,
			requested_major,
			accepting_applications
		}))(req.query);

		const sorts: SortParams = (({ sort_by, order, next }) => ({
			sort_by,
			order,
			next
		}))(req.query);

		const projects = await this.repository.getProjectStubs(filters, sorts);

		res.status(OK).json(projects);
	}

	// * should extract params to interface for all of these methods
	@Post()
	@Middleware([RequiresAuth, Verified("project")])
	public async newProject(req: Request, res: Response) {
		//TODO: extract params to interface
		await this.repository.updateProject(req.body);
		res.sendStatus(OK);
	}

	@Get(":id")
	public async getProjectById(req: Request, res: Response) {
		const response = await this.repository.getProjectDetails(req.params.id);

		res.status(OK).json(response);
	}

	@Put(":id")
	public async updateProject(req: Request, res: Response) {
		res.status(OK);
	}

	@Delete(":id")
	@Middleware([RequiresAuth])
	public async deleteProject(req: Request, res: Response) {
		const item = await this.repository.getProjectDetails(req.params.id);
		//TODO: check that the user is an admin on this project, if not throw a 401.

		await this.repository.deleteProject(req.params.id);
		res.sendStatus(OK);
	}
}
