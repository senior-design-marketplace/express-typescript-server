import { Request, Response } from "express";
import requireFromString from 'require-from-string';
import { EnforcerService } from "../../../external/enforcer/src/EnforcerService";
import { getDefaultMediaLink } from "../../../external/enforcer/src/queries/util";
import { Claims, extractClaims } from '../auth/verify';
import CodedError from "../error/CodedError";
import { AuthenticationError, BadRequestError, InternalError } from "../error/error";
import * as validators from '../types/build/validators.json';

declare global {
    namespace Express {
        export interface Request {
            claims: Claims
        }
    }
}

/**
 * Force the user information through to the database.  In this way,
 * we incur some overhead, however, we get to persist all information
 * from Cognito into our database.
 */
async function writeThroughUser(req: Request) {
    const enforcerService: EnforcerService = req.app.get('enforcerService');

    try {
        await enforcerService.createUser(
            {
                payload: {
                    id: req.claims.username,
                    firstName: req.claims.givenName,
                    lastName: req.claims.familyName,
                    email: req.claims.email,
                    thumbnailLink: getDefaultMediaLink(),
                    roles: req.claims.roles
                },
                claims: req.claims,
                resourceIds: [ req.claims.username ]
            },
            {
                asAdmin: true,
                noRelations: true
            }
        )
    } catch (err) {
        await enforcerService.updateUser(
            {
                payload: {
                    id: req.claims.username,
                    firstName: req.claims.givenName,
                    lastName: req.claims.familyName,
                    email: req.claims.email,
                    roles: req.claims.roles
                },
                claims: req.claims,
                resourceIds: [ req.claims.username ]
            },
            {
                asAdmin: true,
                noRelations: true
            }
        )
    }
}

async function examineToken(req: Request) {
    if (!req.query.id_token) throw new AuthenticationError("No token provided");
    
    try {
        req.claims = extractClaims(req.query.id_token);
        await writeThroughUser(req);
    } catch (e) {
        throw new AuthenticationError("Verification failed");
    }
}

export async function RespondsToAuth(req: Request, res: Response, next) {
    try {
        await examineToken(req);
        next();
    } catch (err) {
        next(); // disregard exception
    }
}

export async function RequiresAuth (req: Request, res: Response, next) {
    try {
        await examineToken(req);
        next();
    } catch (err) {
        next(err);
    }
}

type ValidatorFunction = (param: string) => boolean;
export function VerifyPath(param: string, validator: ValidatorFunction) {
    return (req: Request, res: Response, next) => {
        if (validator(req.params[param])) next();
        else next(new BadRequestError(`Value ${req.params[param]} for name ${param} is invalid`))
    }
}

export function VerifyBody(param: string) {
    return (req: Request, res: Response, next) => {
        const code = validators[param];

        if (!code) next(new InternalError(`No validator function found for "${param}"`));
        else {
            const validator = requireFromString(code);
            if (!validator(req.body)) next(new BadRequestError('Malformed request'));
            else next();
        }
    }
}

export function HandleErrors(errors: typeof CodedError[]) {
	return (error: Error, req: Request, res: Response, next: any) => {
		for (const clazz of errors) {
			if (error instanceof clazz) {
				return res.status(error.code).json({
					type: error.name,
					message: error.message
				});
			}
		}
		next(error);
	};
}
