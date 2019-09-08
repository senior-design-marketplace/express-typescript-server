import { Request, Response } from 'express';
import { InternalError, AuthenticationError, BadRequestError } from '../error/error';
import { CustomError } from 'ts-custom-error';
import CodedError from '../error/CodedError';

//extract the api gateway event header and pull it onto the request
export const RequiresAuth: any = (req: Request, res: Response, next: any) => {
    try {
        const event: string = req.headers['x-apigateway-event'] as string;
        const decoded: any = JSON.parse(decodeURIComponent(event));
        req.headers.cognitoIdentityId = decoded.requestContext.identity.cognitoIdentityId;
        
        if (!req.headers.cognitoIdentityId) {
            next(new AuthenticationError('No identity supplied with request'))
        } else {
            next();
        }
    } catch (e) {
        //TODO: maybe a bad request?
        next(new AuthenticationError('Could not parse identity information from request'));
    }
}

//provide a middleware to the calling route to verify incoming requests against
//a known JSON schema
export function Verified(schema: string) {
    const validators = {
        project: require('../schemas/build/project')
    }

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

export function HandleErrors(errors: typeof CodedError[]) {
    return (error: Error, req: Request, res: Response, next: any) => {
        //make sure that the given error is one that we are checking for on this route
        for(let clazz of errors) {
            if(error instanceof clazz) {
                return res.status(error.code).json({
                    type: error.name,
                    message: error.message
                })
            }
        }
        //we didn't have it in our checked errors, pass it on
        next(error);
    }
}
