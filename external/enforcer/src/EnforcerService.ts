import { CustomError } from "ts-custom-error";
import { Claims } from "../../../core/src/access/auth/verify";

/**
 * A poor man's implementation of ABAC.  Here, you have all of the
 * necessary components of ABAC:
 * 1.   Subject - The user initiating the request.  We represent
 *      this through our claims object.
 * 2.   Object - The resource being acted upon.  Represented by the
 *      top level key (e.g. comment) as well as a set of resource
 *      IDs.  These IDs follow a RESTful format.
 * 3.   Action - The action being taken on the resource.  Typically
 *      CRUD.  Represented via the intermediate key (e.g. delete).
 */

export class PolicyApplicationFailedError extends CustomError {

    constructor(message: string = "Policy application failed") {
        super(message);
    }
}

export type Actions = 'create' | 'read' | 'update' | 'delete';

type Enforcer = (claims: Claims, ...resourceIds: string[]) => Promise<boolean>;

export type UnauthenticatedServiceCall<T> = {
    payload: T;
    resourceIds: string[]
};

export type AuthenticatedServiceCall<T> = {
    claims: Claims
} & UnauthenticatedServiceCall<T>;

export type Policy<R extends string, A extends string> = Partial<Record<R, Partial<Record<A, Enforcer>>>>;

export class EnforcerService<R extends string, A extends string> {

    private policies: Policy<R, A>;

    constructor() {
        this.policies = {};
    }

    public addPolicies(policies: Policy<R, A>[]): void {
        for (const policy of policies) {
            for (const resource of Object.keys(policy)) {
                this.policies[resource] = this.policies[resource] || {};

                for (const action of Object.keys(policy[resource])) {
                    if (this.policies[resource][action]) {
                        throw new Error(`Duplicate policy found for action ${action} on resource ${resource}`);
                    }

                    this.policies[resource][action] = policy[resource][action];
                }
            }
        }
    }

    // if no policies are defined for this resource or this specific action
    // if not defined, permit the action
    public async enforce(claims: Claims, action: A, resource: R, ...resourceIds: string[]): Promise<void> {
        const actions = this.policies[resource];
        if (actions) {
            const enforcer = actions[action];
            if (!enforcer) {
                console.warn(`No action ${action} found for resource ${resource}`);
            } else {
                if (!await enforcer(claims, ...resourceIds)) throw new PolicyApplicationFailedError();
            }
        } else {
            console.error(`No resource found for ${resource}`);
        }
    }
}