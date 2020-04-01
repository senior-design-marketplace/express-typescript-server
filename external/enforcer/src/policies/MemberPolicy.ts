import { Membership } from "../../../../lib/types/base/Membership";
import { Actions, Policy } from "../Enforcer";
import { MaybeAuthenticatedServiceCall } from "../EnforcerService";
import { describeMembership } from "../queries/util";
import { Resources } from "../resources/resources";
import { getAuthenticationRequiredView } from "./util";

export const MemberPolicy: Policy<Resources, Actions, Partial<Membership>> = {

    'project.member': {
        /**
         * An administrator can attempt to promote or demote a user, given that
         * the user is actually part of the project in question.
         */
        update: async (call: MaybeAuthenticatedServiceCall<Partial<Membership>>, ...resourceIds: string[]) => {
            if (!call.claims) {
                return getAuthenticationRequiredView();
            }

            const projectId = resourceIds[0];
            const userId = resourceIds[1];

            const initiate = await describeMembership(projectId, call.claims.username);
            
            if (initiate?.role === "ADMINISTRATOR") {
                const target = await describeMembership(projectId, userId);

                if (!target) {
                    return {
                        view: 'hidden'
                    }
                }

                // cannot promote to a role they already possess
                if ((target.role === call.payload.role) && (target.isAdvisor === call.payload.isAdvisor)) {
                    return {
                        view: 'blocked'
                    }
                }

                return {
                    view: 'verbose'
                }
            }

            return {
                view: 'blocked'
            }
        },

        /**
         * A user can delete anyone else on the project if they are an administrator.
         * They can also delete themselves from the project at any time.
         */
        delete: async (call: MaybeAuthenticatedServiceCall<Partial<Membership>>, ...resourceIds: string[]) => {
            if (!call.claims) {
                return getAuthenticationRequiredView();
            }

            const projectId = resourceIds[0];
            const userId = resourceIds[1];

            const target = await describeMembership(projectId, userId);

            // the target can actually be removed
            if (target) {

                if (userId === call.claims.username) {
                    return {
                        view: 'verbose'
                    }
                }

                const initiate = await describeMembership(projectId, call.claims.username)
                if (initiate?.role === "ADMINISTRATOR") {
                    return {
                        view: 'verbose'
                    }
                }

                return {
                    view: 'blocked'
                }
            }

            return {
                view: 'hidden'
            }
        }
    }
}