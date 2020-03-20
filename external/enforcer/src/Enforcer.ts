import { MaybeAuthenticatedServiceCall } from "./EnforcerService";

/**
 * A poor man's implementation of ABAC.  Here, you have all of the
 * necessary components of ABAC:
 * 1.   Subject - The user initiating the request.  We represent
 *      this through our claims object.
 * 2.   Object - The resource being acted upon.  Represented by a
 *      series of resource IDs.  These IDs are assumed to lead
 *      heirarchically to the object being acted upon.
 * 3.   Action - The action being taken on the resource.  These
 *      expand beyond RESTful actions.
 */

export type EnforcementResult = {
    view: View;
    reason?: string
}

export type View = 'error' | 'hidden' | 'blocked' | 'partial' | 'verbose' | 'full';
export type Actions = 'create' | 'list' | 'describe' | 'update' | 'delete' | 'reply';

type EnforcerFunction<T extends object> = (call: MaybeAuthenticatedServiceCall<T>, ...resourceIds: string[]) => Promise<EnforcementResult>;
export type Policy<R extends string, A extends string, T extends object> = Partial<Record<R, Partial<Record<A, EnforcerFunction<T>>>>>;

export class Enforcer<R extends string, A extends string, T extends object> {

    private policies: Policy<R, A, T>;

    constructor() {
        this.policies = {};
    }

    public addPolicies(policies: Policy<R, A, T>[]): void {
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

    public async enforce(action: A, resource: R, call: MaybeAuthenticatedServiceCall<T>, ...resourceIds: string[]): Promise<EnforcementResult> {
        const actions = this.policies[resource];
        if (actions) {
            const enforcer = actions[action];
            if (!enforcer) {
                throw new Error(`No action "${action}" found for resource "${resource}"`);
            } else {
                return enforcer(call, ...resourceIds);
            }
        } else {
            throw new Error(`No resource "${resource}" found`);
        }
    }
}
