import { ClassOptions, ClassWrapper, Controller, Get, Middleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import AsyncHandler from "express-async-handler";
import RootService from '../../service/RootService';
import { RespondsToAuth } from '../middlewares';

@ClassWrapper(AsyncHandler)
@ClassOptions({ mergeParams: true })
@Controller("")
export default class RootController {

    constructor(private readonly rootService: RootService) {}

    @Get("")
    @Middleware([ RespondsToAuth ])
    public async loadRoot(req: Request, res: Response) {
        if (req.claims) {
            res.status(200).json(await this.rootService.loadRootAuthenticated(req.claims.username))
        } else {
            res.status(200).json(await this.rootService.loadRoot());
        }
    }
}