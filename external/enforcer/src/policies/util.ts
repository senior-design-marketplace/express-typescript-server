import { EnforcementResult } from "../Enforcer";

export function getResourceMismatchView(outerResource: string, innerResource: string): EnforcementResult {
    return {
        view: 'hidden'
    }
}

export function getAuthenticationRequiredView(): EnforcementResult {
    return {
        view: 'error',
        reason: 'Authentication required'
    }
}