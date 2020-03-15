import { Claims } from "../../../../core/src/access/auth/verify";
import InviteModel from "../../../../core/src/access/models/InviteModel";
import { describeMembership } from "../../../../core/src/access/queries/util";
import { Actions, Policy } from "../EnforcerService";
import { Resources } from "../resources/resources";

export const InvitePolicy: Policy<Resources, Actions> = {

    'invite': {
        /**
         * Only administrators can create an invite for a project.
         */
        create: async (claims: Claims, ...resourceIds: string[]) => {
            const projectId = resourceIds[0];

            const { isAdministrator } = await describeMembership(projectId, claims.username);
            return isAdministrator;
        },

        /**
         * Only administrators and the targeted user can view the
         * invite.
         */
        read: async (claims: Claims, ...resourceIds: string[]) => {
            const projectId = resourceIds[0];
            const inviteId = resourceIds[1];

            const invite = await InviteModel.query()
                .findById(inviteId)
                .throwIfNotFound();

            if (invite.targetId === claims.username) {
                return true;
            }

            const { isAdministrator } = await describeMembership(projectId, claims.username);
            return isAdministrator;
        },

        /**
         * Only the targeted user can update the invite.  The
         * invite must not have been updated already.
         */
        update: async (claims: Claims, ...resourceIds: string[]) => {
            const projectId = resourceIds[0];
            const inviteId = resourceIds[1];

            const invite = await InviteModel.query()
                .findById(inviteId)
                .throwIfNotFound();

            if (invite.status !== 'PENDING') {
                return false;
            }

            return invite.targetId === claims.username;
        },

        /**
         * Only administrators can delete an invite once it is
         * sent out.  If the invite has already been responded
         * to, then it is incapable of being deleted.
         */
        delete: async (claims: Claims, ...resourceIds: string[]) => {
            const projectId = resourceIds[0];
            const inviteId = resourceIds[1];

            const invite = await InviteModel.query()
                .findById(inviteId)
                .throwIfNotFound();

            if (invite.status !== 'PENDING') {
                return false;
            }

            const { isAdministrator } = await describeMembership(projectId, claims.username);
            return isAdministrator;
        }
    }
}