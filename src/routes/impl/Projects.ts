import { Controller, Middleware, Get, Post, Put, Delete, ClassWrapper, Wrapper } from '@overnightjs/core';
import { Request, Response, NextFunction } from 'express';
import { RequiresAuth } from '../middlewares';
import { Verified } from '../middlewares';
import { OK } from 'http-status-codes';
import { Access } from '../../access/dao';
import asyncHandler from 'express-async-handler';
import { QueryParams } from '../../schemas/build/queryParams';

@ClassWrapper(asyncHandler)
@Controller('projects')
export default class ProjectsController {

    constructor(private readonly repository: Access.Repository) {}

    @Get()
    @Middleware([Verified('queryParams', { query: true })])
    public async getProjects(req: Request, res: Response) {
        const params: QueryParams = {}

        //TODO: just check that it exists on the access layer
        if(req.query.tag) params.tag = req.query.tag;
        if(req.query.advisor_id) params.advisor_id = req.query.advisor_id;
        if(req.query.has_advisor) params.has_advisor = req.query.has_advisor;
        if(req.query.requested_major) params.requested_major = req.query.requested_major;
        if(req.query.accepting_applications) params.accepting_applications = req.query.accepting_applications;

        if(req.query.sort_by) params.sort_by = req.query.sort_by;
        if(req.query.order) params.order = req.query.order;
        if(req.query.next) params.next = req.query.next;

        console.log(params);

        const projects = await this.repository.getProjectStubs(params);

        res.status(OK).json(projects);
    }

    @Post()
    @Middleware([RequiresAuth, Verified('project')])
    public async newProject(req: Request, res: Response) {
        //TODO: extract params to interface instead of passing in body,
        //can then reduce code in accessor
        await this.repository.updateProject(req.body);
        res.sendStatus(OK);
    }

    @Get(':id')
    public async getProjectById(req: Request, res: Response) {
        const response = await this.repository.getProjectDetails(req.params.id);

        //TODO: format and return the response from dynamo
        res.status(OK).json(response);
    }

    //TODO: implement
    @Put(':id')
    public async updateProject(req: Request, res: Response) {
        res.status(OK);
    }

    @Delete(':id')
    @Middleware([RequiresAuth])
    public async deleteProject(req: Request, res: Response) {
        const item = await this.repository.getProjectDetails(req.params.id);
        //TODO: check that the user is an admin on this project, if not throw a 401.
        
        await this.repository.deleteProject(req.params.id);
        res.sendStatus(OK);
    }
}
