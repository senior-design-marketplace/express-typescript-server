import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { RequiresAuth } from '../../../../../middlewares';

@Controller('projects/:projectId/comments/:commentId')
export default class CommentsIdController {

    constructor(private readonly documentClient: DocumentClient) {}

    @Post()
    @Middleware(RequiresAuth)
    public async newReply(req: Request, res: Response) {
        //TODO
        res.sendStatus(200);
    }

    @Put()
    @Middleware(RequiresAuth)
    public async editComment(req: Request, res: Response) {
        //TODO
        res.sendStatus(200);
    }

    @Delete()
    @Middleware(RequiresAuth)
    public async deleteComment(req: Request, res: Response) {
        //TODO
        res.sendStatus(200);
    }
}
