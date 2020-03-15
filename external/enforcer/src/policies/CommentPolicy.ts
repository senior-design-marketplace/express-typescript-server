import { Claims } from "../../../../core/src/access/auth/verify";
import CommentModel from "../../../../core/src/access/models/CommentModel";
import { describeMembership } from "../../../../core/src/access/queries/util";
import { Actions, Policy } from "../EnforcerService";
import { Resources } from "../resources/resources";

export const CommentPolicy: Policy<Resources, Actions> = {

    'comment': {
        /**
         * Anyone can post or reply to a comment.
         */
        create: async (claims: Claims, ...resourceIds: string[]) => {
            switch (resourceIds.length) {
                case 1: // an original comment
                    return true;

                case 2: // a reply to a comment
                    const projectId = resourceIds[0];
                    const commentId = resourceIds[1];

                    const comment = await CommentModel.query()
                        .findById(commentId)
                        .throwIfNotFound();
                    
                    return comment.projectId === projectId;

                default:
                    throw new Error("Invalid argument length");
            }
        },

        /**
         * Only the author of the comment can edit it.
         */
        update: async (claims: Claims, ...resourceIds: string[]) => {
            const projectId = resourceIds[0];
            const commentId = resourceIds[1];

            const comment = await CommentModel.query()
                .findById(commentId)
                .throwIfNotFound();

            if (comment.projectId !== projectId) {
                return false;
            }

            return comment.userId === commentId;
        },

        /**
         * Either the author of the comment or an administrator
         * of the project that the comment is posted on can
         * delete a comment.
         */
        delete: async (claims: Claims, ...resourceIds: string[]) => {
            const projectId = resourceIds[0];
            const commentId = resourceIds[1];

            const comment = await CommentModel.query()
                .findById(commentId)
                .throwIfNotFound();

            if (comment.projectId !== projectId) {
                return false;
            }
            if (comment.userId === claims.username) {
                return true;
            }
            
            const { isAdministrator } = await describeMembership(projectId, claims.username);
            return isAdministrator;
        }
    }
}