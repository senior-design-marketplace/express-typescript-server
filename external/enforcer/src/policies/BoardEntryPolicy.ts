import { Claims } from "../../../../core/src/access/auth/verify";
import BoardItemModel from "../../../../core/src/access/models/BoardItemModel";
import { describeMembership } from "../../../../core/src/access/queries/util";
import { Actions, Policy } from "../EnforcerService";
import { Resources } from "../resources/resources";

export const BoardEntryPolicy: Policy<Resources, Actions> = {

    'entry': {
        /**
         * Only a contributor or an administrator on a project can
         * create a board entry.
         */
        create: async (claims: Claims, ...resourceIds: string[]) => {
            const projectId = resourceIds[0];

            const { isContributor, isAdministrator } = await describeMembership(projectId, claims.username);
            return isContributor || isAdministrator;
        },

        /**
         * Only a contributor or an administrator can update a board
         * entry.  Media board entries cannot be updated in this way.
         * They are updated by a separate backend process.
         */
        update: async (claims: Claims, ...resourceIds: string[]) => {
            const projectId = resourceIds[0];
            const entryId = resourceIds[1];

            const entry = await BoardItemModel.query()
                .findById(entryId)
                .throwIfNotFound();

            if (entry.projectId !== projectId) {
                return false;
            }

            if (entry.document.type === 'MEDIA') {
                return false;
            }

            const { isContributor, isAdministrator } = await describeMembership(projectId, claims.username);
            return isContributor || isAdministrator;
        },

        /**
         * Only a contributor or an administrator can delete a board
         * entry.
         */
        delete: async (claims: Claims, ...resourceIds: string[]) => {
            const projectId = resourceIds[0];
            const entryId = resourceIds[1];

            const entry = await BoardItemModel.query()
                .findById(entryId)
                .throwIfNotFound();

            if (entry.projectId !== projectId) {
                return false;
            }

            const { isContributor, isAdministrator } = await describeMembership(projectId, claims.username);
            return isContributor || isAdministrator;
        }
    }
}