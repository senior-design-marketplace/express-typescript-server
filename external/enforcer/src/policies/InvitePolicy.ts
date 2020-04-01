import { InviteShared } from "../../../../lib/types/shared/InviteShared";
import { Actions, Policy } from "../Enforcer";
import { MaybeAuthenticatedServiceCall } from "../EnforcerService";
import { InviteModel } from "../models/InviteModel";
import { UserModel } from "../models/UserModel";
import { describeMembership } from "../queries/util";
import { Resources } from "../resources/resources";
import { getAuthenticationRequiredView, getResourceMismatchView } from "./util";

export const InvitePolicy: Policy<Resources, Actions, Partial<InviteShared>> = {

    'project.invite': {
        /**
         * Only administrators can create an invite for a project.
         */
        create: async (call: MaybeAuthenticatedServiceCall<Partial<InviteShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
                return getAuthenticationRequiredView();
            }
            
            const projectId = resourceIds[0];

            const membership = await describeMembership(projectId, call.claims.username);
            if (membership?.role === "ADMINISTRATOR") {

                if (call.payload.isAdvisor) {
                    if (!call.payload.targetId) {
                        return {
                            view: 'blocked',
                            reason: 'No target specified'
                        }
                    }

                    const target = await UserModel.query().findById(call.payload.targetId)
                        .throwIfNotFound();

                    if (!target.roles.includes("faculty")) {
                        return {
                            view: 'blocked',
                            reason: 'Target cannot elevate to provided role'
                        }
                    }
                }

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
        describe: async (call: MaybeAuthenticatedServiceCall<Partial<InviteShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
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

            if (invite.targetId === call.claims.username) {
                return {
                    view: 'verbose'
                }
            }

            const membership = await describeMembership(projectId, call.claims.username);
            if (membership?.role === "ADMINISTRATOR") {
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
        update: async (call: MaybeAuthenticatedServiceCall<Partial<InviteShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
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

            if (invite.targetId === call.claims.username) {
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
        delete: async (call: MaybeAuthenticatedServiceCall<Partial<InviteShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
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

            const membership = await describeMembership(projectId, call.claims.username);
            if (membership?.role === "ADMINISTRATOR") {
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