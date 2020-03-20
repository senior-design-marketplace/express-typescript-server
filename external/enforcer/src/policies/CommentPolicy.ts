import { Claims } from "../../../../core/src/auth/verify";
import CommentModel from "../models/CommentModel";
import { describeMembership } from "../queries/util";
import { Actions, Policy } from "../Enforcer";
import { Resources } from "../resources/resources";
import { getResourceMismatchView, getAuthenticationRequiredView } from "./util";

export const CommentPolicy: Policy<Resources, Actions> = {

    'project.comment': {
        /**
         * Anyone can post or reply to a comment.
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
         * Only the author of the comment can edit it.
         */
        update: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return getAuthenticationRequiredView();
            }
            
            const projectId = resourceIds[0];
            const commentId = resourceIds[1];

            const comment = await CommentModel.query()
                .findById(commentId)
                .throwIfNotFound();

            if (comment.projectId !== projectId) {
                return getResourceMismatchView(projectId, commentId);
            }

            if (comment.userId === commentId) {
                return {
                    view: 'verbose'
                }
            }

            return {
                view: 'blocked',
                reason: 'User is not the author of this comment'
            }
        },

        /**
         * Anyone can reply to a comment.
         */
        reply: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return getAuthenticationRequiredView();
            }

            const projectId = resourceIds[0];
            const commentId = resourceIds[1];

            const comment = await CommentModel.query()
                .findById(commentId)
                .throwIfNotFound();

            if (comment.projectId !== projectId) {
                return getResourceMismatchView(projectId, commentId);
            }

            return {
                view: 'verbose'
            }
        },

        /**
         * Either the author of the comment or an administrator
         * of the project that the comment is posted on can
         * delete a comment.
         */
        delete: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return getAuthenticationRequiredView();
            }
            
            const projectId = resourceIds[0];
            const commentId = resourceIds[1];

            const comment = await CommentModel.query()
                .findById(commentId)
                .throwIfNotFound();

            if (comment.projectId !== projectId) {
                return getResourceMismatchView(projectId, commentId);
            }
            if (comment.userId === claims.username) {
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
                view: 'blocked',
                reason: 'User does not have appropriate credentials'
            }
        }
    }
}