import { Policy, CRUDActions } from "../EnforcerService";
import { Claims } from "../../../access/auth/verify";
import CommentModel from "../../../access/models/CommentModel";
import { describeMembership } from "../../../access/queries/util";

export const CommentPolicy: Policy<CRUDActions> = {
    'update': async (claims: Claims, ...resourceIds: string[]) => {
        const projectId = resourceIds[0];
        const commentId = resourceIds[1];

        const comment = await CommentModel.query()
            .findById(commentId)
            .throwIfNotFound();

        return comment.userId === commentId;
    },
    'delete': async (claims: Claims, ...resourceIds: string[]) => {
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