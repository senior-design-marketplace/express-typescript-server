import { ProjectShared } from "../../../../lib/types/shared/ProjectShared";
import { Actions, Policy } from "../Enforcer";
import { MaybeAuthenticatedServiceCall } from "../EnforcerService";
import { describeMembership } from "../queries/util";
import { Resources } from "../resources/resources";
import { getAuthenticationRequiredView } from "./util";

export const ProjectPolicy: Policy<Resources, Actions, Partial<ProjectShared>> = {

    'project': {
        /**
         * Anyone can create a project, so long as they are logged in.
         */
        create: async (call: MaybeAuthenticatedServiceCall<Partial<ProjectShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
                return getAuthenticationRequiredView();
            }

            return {
                view: 'verbose'
            }
        },

        /**
         * Anyone can list projects.
         */
        list: async (call: MaybeAuthenticatedServiceCall<Partial<ProjectShared>>, ...resourceIds: string[]) => {
            return {
                view: 'verbose'
            }
        },

        /**
         * Only administrators can see additional aspects of a project.
         */
        describe: async (call: MaybeAuthenticatedServiceCall<Partial<ProjectShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
                return {
                    view: 'partial'
                }
            }

            const projectId = resourceIds[0];

            const membership = await describeMembership(projectId, call.claims.username);
            if (membership?.role === "ADMINISTRATOR") {
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
        update: async (call: MaybeAuthenticatedServiceCall<Partial<ProjectShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
                return getAuthenticationRequiredView();
            }
            
            const projectId = resourceIds[0];

            const membership = await describeMembership(projectId, call.claims.username);
            if (membership) {
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
        delete: async (call: MaybeAuthenticatedServiceCall<Partial<ProjectShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
                return getAuthenticationRequiredView();
            }

            const projectId = resourceIds[0];
            
            const membership = await describeMembership(projectId, call.claims.username);
            if (membership?.role === "ADMINISTRATOR") {
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
        update: async (call: MaybeAuthenticatedServiceCall<Partial<ProjectShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
                return getAuthenticationRequiredView();
            }

            const projectId = resourceIds[0];

            const membership = await describeMembership(projectId, call.claims.username);
            if (membership) {
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
        update: async (call: MaybeAuthenticatedServiceCall<Partial<ProjectShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
                return getAuthenticationRequiredView();
            }
            
            const projectId = resourceIds[0];

            const membership = await describeMembership(projectId, call.claims.username);
            if (membership) {
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