import { Actions, Policy } from "../Enforcer";
import { Resources } from "../resources/resources";
import { Claims } from "../../../../core/src/auth/verify";
import { getAuthenticationRequiredView } from "./util";

export const UserPolicy: Policy<Resources, Actions> = {

    'user': {
        /**
         * Only the administrator can create users.
         */
        create: async (claims?: Claims, ...resourceIds: string[]) => {
            return {
                view: 'blocked',
                reason: 'User does not have appropriate credentials'
            }
        },

        /**
         * A user can only view their own details.
         */
        describe: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return {
                    view: 'partial'
                }
            }

            const userId = resourceIds[0];

            if (userId === claims.username) {
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
        update: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return getAuthenticationRequiredView();
            }

            const userId = resourceIds[0];

            if (userId === claims.username) {
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
        update: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return getAuthenticationRequiredView();
            }
            
            const userId = resourceIds[0];

            if (userId === claims.username) {
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
