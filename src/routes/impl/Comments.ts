import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { RequiresAuth } from '../middlewares';

@Controller('projects/:id/comments')
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

    @Post('/:id')
    @Middleware(RequiresAuth)
    public async newReply(req: Request, res: Response) {
        //TODO
        res.sendStatus(200);
    }

    @Put('/:id')
    @Middleware(RequiresAuth)
    public async editComment(req: Request, res: Response) {
        //TODO
        res.sendStatus(200);
    }

    @Delete('/:id')
    @Middleware(RequiresAuth)
    public async deleteComment(req: Request, res: Response) {
        //TODO
        res.sendStatus(200);
    }
}
