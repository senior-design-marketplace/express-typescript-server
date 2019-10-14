import { Request, Response, NextFunction } from "express";
import { AuthenticationError, BadRequestError } from "../error/error";
import CodedError from "../error/CodedError";

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

//provide a middleware to the calling route to verify incoming requests against
//a known JSON schema
export function Verified(schema: string, query?: boolean) {
	const validators = {
		project: require("../schemas/build/project"),
		queryParams: require("../schemas/build/queryParams")
	};

	return (req: Request, res: Response, next: any) => {
		//first, go get the bundled schema for this model (maybe later for this route?  Could we auto-infer this somehow?)
		const validator = validators[schema];
		if (!validator)
			throw new Error(
				`Unknown schema for name ${schema}, did you add this in ${__filename}?`
			);

		const validatee = query ? req.query : req.body;

		//if the request isn't valid, pass the error onto the handler
		if (!validator(validatee)) {
			console.log(
				`${req.method} request on ${req.path} failed validation against schema: ${schema}`
			);
			next(new BadRequestError(`Malformed request`));
		} else {
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
