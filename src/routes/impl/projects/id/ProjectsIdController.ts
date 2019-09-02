import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { RequiresAuth } from '../../../middlewares';

@Controller('projects/:projectId')
export default class ProjectsIdController {

    constructor(private readonly documentClient: DocumentClient) {}

    @Delete()
    @Middleware(RequiresAuth)
    public async deleteProject(req: Request, res: Response) {
        //TODO
        res.sendStatus(200);
    }

    @Get()
    public async getProjectById(req: Request, res: Response) {
        //TODO
        res.sendStatus(200);
    }
}
