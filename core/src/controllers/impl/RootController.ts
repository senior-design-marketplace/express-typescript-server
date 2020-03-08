import { ClassOptions, ClassWrapper, Controller, Get, Middleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import AsyncHandler from "express-async-handler";
import RootService, { LoadRootResult, LoadRootAuthenticatedResult } from '../../service/RootService';
import { RespondsToAuth } from '../middlewares';
import { extractValue } from './util';

@ClassWrapper(AsyncHandler)
@ClassOptions({ mergeParams: true })
@Controller("")
export default class RootController {

    constructor(private readonly rootService: RootService) {}

    @Get()
    @Middleware([ RespondsToAuth ])
    public async loadRoot(req: Request, res: Response) {
        let result: LoadRootResult | LoadRootAuthenticatedResult;

        if (req.claims) result = await this.rootService.loadRootAuthenticated(req.claims.username);
        else result = await this.rootService.loadRoot();

        const { majors, tags, ...rest } = result;
        res.status(200).json({
            ...rest,
            majors: extractValue(majors),
            tags: extractValue(tags)
        })
    }
}