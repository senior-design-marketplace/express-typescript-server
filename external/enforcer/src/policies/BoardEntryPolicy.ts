import { Claims } from "../../../../core/src/auth/verify";
import { BoardItemModel } from "../models/BoardItemModel";
import { describeMembership } from "../queries/util";
import { Actions, Policy } from "../Enforcer";
import { Resources } from "../resources/resources";
import { getResourceMismatchView, getAuthenticationRequiredView } from "./util";
import { BoardEntryShared } from "../../../../lib/types/shared/BoardEntryShared";
import { MaybeAuthenticatedServiceCall } from "../EnforcerService";

export const BoardEntryPolicy: Policy<Resources, Actions, Partial<BoardEntryShared>> = {

    'project.entry': {
        /**
         * Only a contributor or an administrator on a project can
         * create a board entry.
         */
        create: async (call: MaybeAuthenticatedServiceCall<Partial<BoardEntryShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
                return getAuthenticationRequiredView();
            }
            
            const projectId = resourceIds[0];

            const { isContributor, isAdministrator } = await describeMembership(projectId, call.claims.username);

            if (isContributor || isAdministrator) {
                return {
                    view: 'verbose'
                }
            }

            return {
                view: 'blocked',
                reason: 'User is not a member of this project'
            }
        },

        /**
         * Only a contributor or an administrator can update a board
         * entry.  Media board entries cannot be updated in this way.
         * They are updated by a separate backend process.
         */
        update: async (call: MaybeAuthenticatedServiceCall<Partial<BoardEntryShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
                return getAuthenticationRequiredView();
            }

            const projectId = resourceIds[0];
            const entryId = resourceIds[1];

            const entry = await BoardItemModel.query()
                .findById(entryId)
                .throwIfNotFound();

            if (entry.projectId !== projectId) {
                return getResourceMismatchView(projectId, entryId);
            }

            if (entry.document.type === 'MEDIA') {
                return {
                    view: 'blocked',
                    reason: 'Document type is not capable of being updated'
                }
            }

            const { isContributor, isAdministrator } = await describeMembership(projectId, call.claims.username);
            if (isContributor || isAdministrator) {
                return {
                    view: 'verbose'
                }
            }

            return {
                view: 'blocked',
                reason: 'User is not a member of this project'
            }
        },

        /**
         * Only a contributor or an administrator can delete a board
         * entry.
         */
        delete: async (call: MaybeAuthenticatedServiceCall<Partial<BoardEntryShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
                return getAuthenticationRequiredView();
            }
            
            const projectId = resourceIds[0];
            const entryId = resourceIds[1];

            const entry = await BoardItemModel.query()
                .findById(entryId)
                .throwIfNotFound();

            if (entry.projectId !== projectId) {
                return getResourceMismatchView(projectId, entryId);
            }

            const { isContributor, isAdministrator } = await describeMembership(projectId, call.claims.username);
            if (isContributor || isAdministrator) {
                return {
                    view: 'verbose'
                }
            }

            return {
                view: 'blocked',
                reason: 'User is not a member of this project'
            }
        }
    },

    'project.entry.media': {
        update: async (call: MaybeAuthenticatedServiceCall<Partial<BoardEntryShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
                return getAuthenticationRequiredView();
            }
            
            const projectId = resourceIds[0];
            const entryId = resourceIds[1];

            const entry = await BoardItemModel.query()
                .findById(entryId)
                .throwIfNotFound();

            if (entry.projectId !== projectId) {
                return getResourceMismatchView(projectId, entryId);
            }

            const { isContributor, isAdministrator } = await describeMembership(projectId, call.claims.username);
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