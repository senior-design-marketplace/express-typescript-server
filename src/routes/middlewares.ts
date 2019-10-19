import { Request, Response, NextFunction } from "express";
import { AuthenticationError, BadRequestError } from "../error/error";
import CodedError from "../error/CodedError";
import ProjectValidator from '../schemas/build/validators/project';
import QueryParamsValidator from '../schemas/build/validators/queryParams';

import { keys } from 'ts-transformer-keys';
import { Project } from '../schemas/build/types/project';
import { QueryParams } from "../schemas/build/types/queryParams";
import _ from 'lodash';

//TODO: handle idempotency as a middleware
export const RequiresAuth: any = (req: Request, res: Response, next: any) => {
	try {
		// TODO: pull in the cookie from the request header, if no cookie, throw an authentication error

		// TODO: make a call to shibboleth with the cookie

		// TODO: place a user-specific key onto the incoming request and allow it to pass through

		next();
	} catch (e) {
		next(
			new AuthenticationError(
				"Could not parse identity information from request"
			)
		);
	}
};

interface Extractor {
    validator: (obj) => boolean,
    extract: (string | number)[]
}

const extractors: Record<string, Extractor> = {
    'Project': {
        validator: ProjectValidator,
        extract: keys<Project>()
    },
    'QueryParams': {
        validator: QueryParamsValidator,
        extract: keys<QueryParams>()
    }
}

// extend the request interface to support our verified object
declare global {
    namespace Express {
        export interface Request {
            verified?: any
        }
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
			next(new BadRequestError(`Malformed request`));
		} else {
            req.verified = _.pick(req.body, extractors[schema].extract);
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
