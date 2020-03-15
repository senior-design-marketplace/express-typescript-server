import { Actions, Policy } from "../EnforcerService";
import { Resources } from "../resources/resources";
import { Claims } from "../../../../core/src/access/auth/verify";

export const UserPolicy: Policy<Resources, Actions> = {

    'user': {
        /**
         * A user can only update their own information.
         */
        update: async (claims: Claims, ...resourceIds: string[]) => {
            const userId = resourceIds[0];
            return userId === claims.username;
        }
    },

    'user.avatar': {
        /**
         * A user can only update their own avatar
         */
        update: async (claims: Claims, ...resourceIds: string[]): Promise<boolean> => {
            const userId = resourceIds[0];
            return userId === claims.username;
        }
    }
}
