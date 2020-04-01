import { UserShared } from "../../../../lib/types/shared/UserShared";
import { Actions, Policy } from "../Enforcer";
import { MaybeAuthenticatedServiceCall } from "../EnforcerService";
import { Resources } from "../resources/resources";
import { getAuthenticationRequiredView } from "./util";

export const UserPolicy: Policy<Resources, Actions, Partial<UserShared>> = {

    'user': {
        /**
         * Only the administrator can create users.
         */
        create: async (call: MaybeAuthenticatedServiceCall<Partial<UserShared>>, ...resourceIds: string[]) => {
            return {
                view: 'blocked',
                reason: 'User does not have appropriate credentials'
            }
        },

        /**
         * A user can only view their own details.
         */
        describe: async (call: MaybeAuthenticatedServiceCall<Partial<UserShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
                return {
                    view: 'partial'
                }
            }

            const userId = resourceIds[0];

            if (userId === call.claims.username) {
                return {
                    view: 'verbose'
                }
            }

            return {
                view: 'partial'
            }
        },

        /**
         * A user can only update their own information.
         */
        update: async (call: MaybeAuthenticatedServiceCall<Partial<UserShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
                return getAuthenticationRequiredView();
            }

            const userId = resourceIds[0];

            if (userId === call.claims.username) {
                return {
                    view: 'verbose'
                }
            }

            return {
                view: 'blocked',
                reason: 'User does not have appropriate credentials'
            }
        }
    },

    'user.avatar': {
        /**
         * A user can only update their own avatar
         */
        update: async (call: MaybeAuthenticatedServiceCall<Partial<UserShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
                return getAuthenticationRequiredView();
            }
            
            const userId = resourceIds[0];

            if (userId === call.claims.username) {
                return {
                    view: 'verbose'
                }
            }

            return {
                view: 'blocked',
                reason: 'User does not have appropriate credentials'
            }
        }
    },

    
    'user.resume': {
        /**
         * A user can only update their own resume
         */
        update: async (call: MaybeAuthenticatedServiceCall<Partial<UserShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
                return getAuthenticationRequiredView();
            }
            
            const userId = resourceIds[0];

            if (userId === call.claims.username) {
                return {
                    view: 'verbose'
                }
            }

            return {
                view: 'blocked',
                reason: 'User does not have appropriate credentials'
            }
        }
    }
}
