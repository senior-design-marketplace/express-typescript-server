import { Request, Response } from 'express';
import { InternalError, AuthenticationError, BadRequestError } from '../error/error';

const validators = {
    project: require('../schemas/build/project')
}

//extract the api gateway event header and pull it onto the request
export const RequiresAuth: any = (req: Request, res: Response, next: any) => {
    try {
        const event: string = req.headers['x-apigateway-event'] as string;
        const decoded: any = JSON.parse(decodeURIComponent(event));
        req.headers.cognitoIdentityId = decoded.requestContext.identity.cognitoIdentityId;
        next();
    } catch (e) {
        return res.sendStatus(403);
    }
}

//provide a middleware to the calling route to verify incoming requests against
//a known JSON schema
export function Verified(schema: string) {
    return (req: Request, res: Response, next: any) => {
        //first, go get the bundled schema for this model (maybe later for this route?  Could we auto-infer this somehow?)
        const validator = validators[schema];
        if (!validator) throw new Error(`Unknown schema for name ${schema}, did you add this in ${__filename}?`)
        
        //if the request isn't valid, pass the error onto the handler
        if (!(validator(req.body))) {
            next(new BadRequestError(`Request failed validation against schema: ${schema}`));
        }
    }
}

//use an error handling chain with typed errors to take the burden of error
//handling off of our routes -- declare many more
export const HandleInternalError: any = (error: any, req: Request, res: Response, next: any) => {
    if (error instanceof InternalError) {
        return res.status(500).json({
            type: 'InternalError',
            message: error.message
        });
    }
    next(error);
}

export const HandleAuthenticationError: any = (error: any, req: Request, res: Response, next: any) => {
    if (error instanceof AuthenticationError) {
        return res.status(403).json({
            type: 'AuthenticationError',
            message: error.message
        })
    }
    next(error);
}

export const HandleBadRequestError: any = (error: any, req: Request, res: Response, next: any) => {
    if (error instanceof BadRequestError) {
        return res.status(400).json({
            type: 'BadRequestError',
            message: error.message
        })
    }
    next(error);
}