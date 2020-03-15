import { Actions, Policy } from "../EnforcerService";
import { Claims } from "../../../access/auth/verify";
import { describeMembership } from "../../../access/queries/util";
import { Resources } from "../resources/resources";

export const ProjectPolicy: Policy<Resources, Actions> = {

    'project': {
        /**
         * Either an administrator or a contributor can update
         * a project.
         */
        update: async (claims: Claims, ...resourceIds: string[]) => {
            const projectId = resourceIds[0];

            const { isContributor, isAdministrator } = await describeMembership(projectId, claims.username);
            return isContributor || isAdministrator;
        },

        /**
         * Only an administrator can delete a project.
         */
        delete: async (claims: Claims, ...resourceIds: string[]) => {
            const projectId = resourceIds[0];
            
            const { isAdministrator } = await describeMembership(projectId, claims.username);
            return isAdministrator;
        }
    },

    'project.thumbnail': {
        update: async (claims: Claims, ...resourceIds: string[]) => {
            const projectId = resourceIds[0];

            const { isContributor, isAdministrator } = await describeMembership(projectId, claims.username);
            return isContributor || isAdministrator;
        }
    },

    'project.cover': {
        update: async (claims: Claims, ...resourceIds: string[]) => {
            const projectId = resourceIds[0];

            const { isContributor, isAdministrator } = await describeMembership(projectId, claims.username);
            return isContributor || isAdministrator;
        }
    }
}