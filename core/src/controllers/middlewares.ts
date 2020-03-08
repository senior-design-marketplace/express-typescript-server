import pick from 'lodash/pick';
import CodedError from "../error/CodedError";
import { Request, Response } from "express";
import { AuthenticationError, BadRequestError, AuthorizationError } from "../error/error";
import { extractors } from "./extractors";
import { extractClaims, Claims } from '../access/auth/verify';
import { DescribeProjectMembershipQuery } from "../access/queries/DescribeProjectMembershipQuery";
import { WriteThroughUserQuery } from '../access/queries/WriteThroughUserQuery';

declare global {
    namespace Express {
        export interface Request {
            claims: Claims,
            verified?: any
        }
    }
}

/**
 * Force the user information through to the database.  In this way,
 * we incur some overhead, however, we get to persist all information
 * from Cognito into our database.
 */
async function writeThroughUser(req: Request) {
    const query: WriteThroughUserQuery = req.app.get('writeThroughUserQuery');

    try {
        await query.execute(req.claims);
    } catch (e) {
        // nothing, do not let this failure prevent client from continuing
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
    } catch (e) {
        next(); // disregard exception
    }
}

export async function RequiresAuth (req: Request, res: Response, next) {
    try {
        await examineToken(req);
        next();
    } catch (e) {
        next(e);
    }
}

export function RequiresSelf (param: string) {
    return async (req: Request, res: Response, next: any) => {
        try {
            await examineToken(req);
        } catch (e) {
            next(e);
        }

        if (req.claims.username !== req.params[param]) next(new AuthorizationError("Forbidden"));
        else next();
    }
}

export function RequiresContributor (param: string) {
    return async (req: Request, res: Response, next: any) => {
        try {
            await examineToken(req);
        } catch (e) {
            next(e);
        }

        const query: DescribeProjectMembershipQuery = req.app.get('membershipQuery');
        const { isAdministrator, isContributor } = await query.execute({
            projectId: req.params[param],
            userId: req.claims.username
        })

        if (!isContributor && !isAdministrator) next(new AuthorizationError("Forbidden"));
        else next();
    }
}

export function RequiresAdministrator(param: string) {
    return async (req: Request, res: Response, next: any) => {
        try {
            await examineToken(req);
        } catch (e) {
            next(e);
        }

        const query: DescribeProjectMembershipQuery = req.app.get('membershipQuery');
        const { isAdministrator, isContributor } = await query.execute({
            projectId: req.params[param],
            userId: req.claims.username
        })

        if (!isAdministrator) next(new AuthorizationError("Forbidden"));
        else next();
    }
}

type ValidatorFunction = (param: string) => boolean;
export function VerifyPath(param: string, validator: ValidatorFunction) {
    return (req: Request, res: Response, next) => {
        if (validator(req.params[param])) next();
        else next(new BadRequestError(`Value ${req.params[param]} for name ${param} is invalid`))
    }
}

function getVerificationParameters(param: string) {
    const validator = extractors[param].validator;
    const keys = extractors[param].extract;

    if (!validator || !keys) throw new Error(`Unknown schema for name ${name}, did you add this in ${__filename}?`);
    return { validator, keys };
}

// for now, assume that these calls are mutually exclusive
export function VerifyBody(param: string) {
	return (req: Request, res: Response, next) => {
        const { validator, keys } = getVerificationParameters(param);

        if (!validator(req.body)) next(new BadRequestError('Malformed request'));
        else {
            req.verified = pick(req.body, ...keys);
            next();
        }
    }
}

export function VerifyQuery(param: string) {
    return (req: Request, res: Response, next) => {
        const { validator, keys } = getVerificationParameters(param);

        if (!validator(req.query)) next(new BadRequestError('Malformed request'));
        else {
            req.verified = pick(req.query, ...keys);
            next();
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
