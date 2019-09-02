import { Request, Response } from 'express';
import { InternalError, AuthenticationError } from '../error/error';

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