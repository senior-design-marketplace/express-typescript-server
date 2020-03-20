import { ClassOptions, ClassWrapper, Controller, Get, Middleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import AsyncHandler from "express-async-handler";
import { RespondsToAuth } from '../middlewares';
import { EnforcerService } from '../../../../external/enforcer/src/EnforcerService';
import { applyTransformation } from '../transformers';

@ClassWrapper(AsyncHandler)
@ClassOptions({ mergeParams: true })
@Controller("")
export default class RootController {

    constructor(private readonly enforcerService: EnforcerService) {}

    @Get()
    @Middleware([ RespondsToAuth ])
    public async loadRoot(req: Request, res: Response) {
        const promises = [
            this.enforcerService.listMajors({ payload: {}, claims: req.claims, resourceIds: [] }),
            this.enforcerService.listTags({ payload: {}, claims: req.claims, resourceIds: [] })
        ] as Promise<object>[];

        if (req.claims) {
            promises.push(this.enforcerService.describeUser({ payload: {}, claims: req.claims, resourceIds: [ req.claims.username ]}))
        }

        const [ majors, tags, user ] = await Promise.all(promises);

        res.status(200).json(applyTransformation({
            majors,
            tags,
            ...user
        }));
    }
}