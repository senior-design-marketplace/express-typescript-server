import { Claims } from "../../access/auth/verify";
import { CustomError } from "ts-custom-error";

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

export type CRUDActions = 'create' | 'read' | 'update' | 'delete';
export type Resources = 'user' | 'project' | 'application' | 'invite' | 'entry' | 'comment';

type Enforcer = (claims: Claims, ...resourceIds: string[]) => Promise<boolean>;
export type Policy<A extends string> = Partial<Record<A, Enforcer>>;

export class EnforcerService<A extends string, R extends string> {

    private registered: Partial<Record<R, Policy<A>>>;

    constructor() {
        this.registered = {};
    }

    public addPolicy(resource: R, ...policies: Policy<A>[]): EnforcerService<A, R> {
        this.registered[resource] = this.registered[resource] || {};

        for (const policy of policies) {
            for (const action of Object.keys(policy)) {
                if (this.registered[resource][action]) {
                    console.error(`Duplicate policy found for action ${action} on resource ${resource}.  Overwriting.`);
                }
    
                this.registered[resource][action] = policy[action];
            }
        }

        return this;
    }

    // if no policies are defined for this resource or this specific action
    // if not defined, permit the action
    public async enforce(claims: Claims, action: A, resource: R, ...resourceIds: string[]): Promise<void> {
        const policy = this.registered[resource];

        if (policy) {
            const enforcer = policy[action];

            if (enforcer && !await enforcer(claims, ...resourceIds)) throw new PolicyApplicationFailedError();
        }
    }
}