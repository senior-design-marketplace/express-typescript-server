import { Claims } from "../access/auth/verify";
import { CustomError } from "ts-custom-error";

export type UnauthenticatedServiceCall<T> = {
    payload: T;
}

export type AuthenticatedServiceCall<T> = {
    payload: T;
    claims: Claims;
}

export type ResourceID = {
    resourceId: string;
}

export type NestedResourceID = {
    outerResourceId: string;
    innerResourceId: string;
}

/**
 *  Provide a resource in an unauthenticated manner
 *  {
 *      payload: T;
 *      resourceId: string;
 *  }
 */
export type UnauthenticatedSingleResourceServiceCall<T> = UnauthenticatedServiceCall<T> & ResourceID;

/**
 *  Provide a resource in an authenticated manner
 *  {
 *      payload: T;
 *      claims: { ... };
 *      resourceId: string;
 *  }
 */
export type AuthenticatedSingleResourceServiceCall<T> = AuthenticatedServiceCall<T> & ResourceID;

/**
 *  Provide a two-level nested resource in an unauthenticated manner
 *  {
 *      payload: T;
 *      outerResourceId: string;
 *      innerResourceId: string;
 *  }
 */
export type UnauthenticatedNestedResourceServiceCall<T> = UnauthenticatedServiceCall<T> & NestedResourceID;

/**
 *  Provide a two-level nested resource in an authenticated manner
 *  {
 *      payload: T;
 *      claims: { ... };
 *      outerResourceId: string;
 *      innerResourceId: string;
 *  }
 */
export type AuthenticatedNestedResourceServiceCall<T> = AuthenticatedServiceCall<T> & NestedResourceID;

/**
 * Creates a series of nested try-catch blocks to eventually catch the result of some function
 */
export function translateErrors(errors: typeof CustomError[], klazz: typeof CustomError) {
    return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
        const copy = descriptor.value;

        descriptor.value = async function() {
            try {
                return await copy.apply(this, arguments);
            } catch (e) {
                for (const clazz of errors) {
                    if (e instanceof clazz) {
                        throw new klazz(e.message);
                    }
                }

                throw e;
            }
        }
    }
}