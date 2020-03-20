import { Claims } from "../../../../core/src/auth/verify";
import InviteModel from "../models/InviteModel";
import { describeMembership } from "../queries/util";
import { Actions, Policy } from "../Enforcer";
import { Resources } from "../resources/resources";
import { getResourceMismatchView, getAuthenticationRequiredView } from "./util";

export const InvitePolicy: Policy<Resources, Actions> = {

    'project.invite': {
        /**
         * Only administrators can create an invite for a project.
         */
        create: async (claims?: Claims, ...resourceIds: string[]) => {
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
        },

        /**
         * Only administrators and the targeted user can view the
         * invite.
         */
        describe: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return getAuthenticationRequiredView();
            }

            const projectId = resourceIds[0];
            const inviteId = resourceIds[1];

            const invite = await InviteModel.query()
                .findById(inviteId)
                .throwIfNotFound();

            if (invite.projectId !== projectId) {
                return getResourceMismatchView(projectId, inviteId);
            }

            if (invite.targetId === claims.username) {
                return {
                    view: 'verbose'
                }
            }

            const { isAdministrator } = await describeMembership(projectId, claims.username);
            if (isAdministrator) {
                return {
                    view: 'verbose'
                }
            }

            return {
                view: 'hidden'
            }
        },

        /**
         * Only the targeted user can update the invite.  The
         * invite must not have been updated already.
         */
        update: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return getAuthenticationRequiredView();
            }

            const projectId = resourceIds[0];
            const inviteId = resourceIds[1];

            const invite = await InviteModel.query()
                .findById(inviteId)
                .throwIfNotFound();

            if (invite.projectId !== projectId) {
                return getResourceMismatchView(projectId, inviteId);
            }

            if (invite.status !== 'PENDING') {
                return {
                    view: 'blocked',
                    reason: 'Invite has already been responded to'
                }
            }

            if (invite.targetId === claims.username) {
                return {
                    view: 'verbose'
                }
            }

            return {
                view: 'hidden'
            }
        },

        /**
         * Only administrators can delete an invite once it is
         * sent out.  If the invite has already been responded
         * to, then it is incapable of being deleted.
         */
        delete: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return getAuthenticationRequiredView();
            }
            
            const projectId = resourceIds[0];
            const inviteId = resourceIds[1];

            const invite = await InviteModel.query()
                .findById(inviteId)
                .throwIfNotFound();

            if (invite.projectId !== projectId) {
                return getResourceMismatchView(projectId, inviteId);
            }

            if (invite.status !== 'PENDING') {
                return {
                    view: 'blocked',
                    reason: 'Invite has already been responded to'
                }
            }

            const { isAdministrator } = await describeMembership(projectId, claims.username);
            if (isAdministrator) {
                return {
                    view: 'verbose'
                }
            }

            return {
                view: 'hidden'
            }
        }
    }
}