import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { RequiresAuth } from '../../../../middlewares';

@Controller('projects/:projectId/comments')
export default class CommentsController {

    constructor(private readonly documentClient: DocumentClient) {}

    @Post()
    @Middleware(RequiresAuth)
    public async newComment(req: Request, res: Response) {
        //TODO
        res.sendStatus(200);
    }

    @Delete()
    @Middleware(RequiresAuth)
    public async deleteComments(req: Request, res: Response) {
        //TODO
        res.sendStatus(200);
    }
}
