import { Request, Response } from "express";
import { Access } from '../access/dao';
import { AuthenticationError, BadRequestError, AuthorizationError } from "../error/error";
import CodedError from "../error/CodedError";
import ProjectMutableValidator from '../schemas/build/project/projectMutable/validator';
import ProjectImmutableValidator from '../schemas/build/project/projectImmutable/validator';
import QueryParamsValidator from '../schemas/build/queryParams/validator';

import { keys } from 'ts-transformer-keys';
import { ProjectMutable } from '../schemas/build/project/projectMutable/type';
import { ProjectImmutable } from '../schemas/build/project/projectImmutable/type';
import { QueryParams } from "../schemas/build/queryParams/type";
import { verify, Claims } from '../access/auth/verify';
import _ from 'lodash';

// extend the request interface to support our verified object
declare global {
    namespace Express {
        export interface Request {
            claims: Claims,
            verified?: any
        }
    }
}

const extractClaims = (req: Request, next: any): void => {
    if (!req.query.id_token)
        next(new AuthenticationError("No token provided"));

    const verificationResult = verify(req.query.id_token);
    if (verificationResult.error) {
        next(new AuthenticationError("Verification failed"));
    }

    req.claims = verificationResult.claims;
}

export const RequiresAuth: any = (req: Request, res: Response, next: any) => {
    extractClaims(req, next);
    next();
};

export const RequiresSelf = (param: string) => {
    return (req: Request, res: Response, next: any) => {
        extractClaims(req, next);

        if (req.claims.username !== req.params[param]) {
            next(new AuthorizationError("Forbidden"));
        } else {
            next();
        }
    }
}

export const RequiresContributor = (repository: Access.Repository, param: string) => {
    return async (req: Request, res: Response, next: any) => {
        extractClaims(req, next);

        const isContributor = await repository.isContributor(req.claims.username, req.params[param]);
        if (!isContributor) {
            next(new AuthorizationError("Forbidden"));
        };
        
        next();
    }
}

export const RequiresAdministrator = (repository: Access.Repository, param: string) => {
    return async (req: Request, res: Response, next: any) => {
        extractClaims(req, next);

        const isAdministrator = await repository.isAdministrator(req.claims.username, req.params[param]);
        if (!isAdministrator) {
            next(new AuthorizationError("Forbidden"));
        }

        next();
    }
}

interface Extractor {
    validator: (obj) => boolean,
    extract: (string | number)[]
}

const extractors: Record<string, Extractor> = {
    'ProjectMutable': {
        validator: ProjectMutableValidator,
        extract: keys<ProjectMutable>()
    },
    'ProjectImmutable': {
        validator: ProjectImmutableValidator,
        extract: keys<ProjectImmutable>()
    },
    'QueryParams': {
        validator: QueryParamsValidator,
        extract: keys<QueryParams>()
    }
}

//provide a middleware to the calling route to verify incoming requests against
//a known JSON schema
export function Verified(schema: string, query?: boolean) {
	return (req: Request, res: Response, next: any) => {
		//first, go get the bundled schema for this model
		const validator = extractors[schema]?.validator;
		if (!validator)
			throw new Error(`Unknown schema for name ${schema}, did you add this in ${__filename}?`);

		const validatee = query ? req.query : req.body;

		//if the request isn't valid, pass the error onto the handler
		if (!validator(validatee)) {
			console.log(`${req.method} request on ${req.path} failed validation against schema: ${schema}`);
			next(new BadRequestError('Malformed request'));
		} else {
            req.verified = _.pick(validatee, ...extractors[schema].extract);
			next();
		}
	};
}

export function HandleErrors(errors: typeof CodedError[]) {
	return (error: Error, req: Request, res: Response, next: any) => {
		//make sure that the given error is one that we are checking for on this route
		for (let clazz of errors) {
			if (error instanceof clazz) {
				return res.status(error.code).json({
					type: error.name,
					message: error.message
				});
			}
		}
		//we didn't have it in our checked errors, pass it on
		next(error);
	};
}
