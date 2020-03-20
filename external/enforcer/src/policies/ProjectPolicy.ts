import { Actions, Policy } from "../Enforcer";
import { Claims } from "../../../../core/src/auth/verify";
import { describeMembership } from "../queries/util";
import { Resources } from "../resources/resources";
import { getAuthenticationRequiredView } from "./util";

export const ProjectPolicy: Policy<Resources, Actions> = {

    'project': {
        /**
         * Anyone can create a project, so long as they are logged in.
         */
        create: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return getAuthenticationRequiredView();
            }

            return {
                view: 'verbose'
            }
        },

        /**
         * Anyone can list projects.
         */
        list: async (claims?: Claims, ...resourceIds: string[]) => {
            return {
                view: 'verbose'
            }
        },

        /**
         * Only administrators can see additional aspects of a project.
         */
        describe: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return {
                    view: 'partial'
                }
            }

            const projectId = resourceIds[0];

            const { isAdministrator } = await describeMembership(projectId, claims.username);
            if (isAdministrator) {
                return {
                    view: 'verbose'
                }
            }

            return {
                view: 'partial'
            }
        },

        /**
         * Either an administrator or a contributor can update
         * a project.
         */
        update: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return getAuthenticationRequiredView();
            }
            
            const projectId = resourceIds[0];

            const { isContributor, isAdministrator } = await describeMembership(projectId, claims.username);
            if (isContributor || isAdministrator) {
                return {
                    view: 'verbose'
                }
            }

            return {
                view: 'blocked',
                reason: 'User does not have appropriate credentials'
            }
        },

        /**
         * Only an administrator can delete a project.
         */
        delete: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return getAuthenticationRequiredView();
            }

            const projectId = resourceIds[0];
            
            const { isAdministrator } = await describeMembership(projectId, claims.username);
            if (isAdministrator) {
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

    'project.thumbnail': {
        update: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return getAuthenticationRequiredView();
            }

            const projectId = resourceIds[0];

            const { isContributor, isAdministrator } = await describeMembership(projectId, claims.username);
            if (isContributor || isAdministrator) {
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

    'project.cover': {
        update: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return getAuthenticationRequiredView();
            }
            
            const projectId = resourceIds[0];

            const { isContributor, isAdministrator } = await describeMembership(projectId, claims.username);
            if (isContributor || isAdministrator) {
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