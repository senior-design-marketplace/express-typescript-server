import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { RequiresAuth } from '../../middlewares';

enum SearchableTerms {
    new,
    hot,
    major,
    name,
    sponsor,
    contributor,
    interests,
    advisor
}

@Controller('projects')
export default class ProjectsController {

    constructor(protected readonly documentClient: DocumentClient) {}

    @Get()
    public async getProjects(req: Request, res: Response) {
        //TODO: implement the query params searching and sorting here 
        res.sendStatus(200);
    }

    @Post()
    @Middleware(RequiresAuth)
    public async newProject(req: Request, res: Response) {
        //TODO
        res.sendStatus(200);
    }
}
