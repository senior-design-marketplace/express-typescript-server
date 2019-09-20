import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { RequiresAuth } from '../middlewares';
import { Verified } from '../middlewares';
import { InternalError } from '../../error/error';
import { OK, CREATED } from 'http-status-codes';
import HitTracker from '../helpers/hitTracker';

@Controller('projects')
export default class ProjectsController {

    constructor(private readonly documentClient: DocumentClient,
                private readonly hitTracker: HitTracker) {}

    @Get()
    @Middleware([Verified('filterAndSortParams', { query: true })])
    public async getProjects(req: Request, res: Response) {
        //TODO: extract the sorting and filtering parameters
        //from the querystring

        //TODO: apply sorting and filtering to the DynamoDB call
        //TODO: first need to implement GSI and database schema
        res.sendStatus(200);
    }

    @Post()
    @Middleware([RequiresAuth, Verified('project')])
    public async newProject(req: Request, res: Response) {
        //TODO: extract the necessary items from the request

        //tack on the corresponding information, such as the
        //cognito identity, then send it up

        const params: any = {
            TableName: 'marqetplace-projects',
            Item: req.body
        }

        try {
            await this.documentClient.put(params).promise();
            res.sendStatus(CREATED);
        } catch (e) {
            throw new InternalError('Call to dynamo failed');
        }
    }

    @Delete('/:id')
    @Middleware(RequiresAuth)
    public async deleteProject(req: Request, res: Response) {
        //firstly, pull down the project with that id, if there
        //is none, throw a 404
        
        //if the user is not an admin on that project, then throw a 401
        res.sendStatus(200);
    }

    @Get('/:id')
    public async getProjectById(req: Request, res: Response) {
        //TODO: Can we wrap this into a hit-tracking middleware instead?
        await this.hitTracker.hit(req.params.id);

        //now try to go get this thing
        const params: any = {
            TableName: 'marqetplace-projects',
            Key: { id: req.params.id }
        }

        try {
            const response = await this.documentClient.get(params).promise();
            res.status(OK).json(response.Item);
        } catch(e) {
            throw new InternalError('Call to dynamo failed');
        }
    }
}
