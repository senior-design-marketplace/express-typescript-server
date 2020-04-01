import { CommentShared } from "../../../../lib/types/shared/CommentShared";
import { Actions, Policy } from "../Enforcer";
import { MaybeAuthenticatedServiceCall } from "../EnforcerService";
import { CommentModel } from "../models/CommentModel";
import { describeMembership } from "../queries/util";
import { Resources } from "../resources/resources";
import { getAuthenticationRequiredView, getResourceMismatchView } from "./util";

export const CommentPolicy: Policy<Resources, Actions, Partial<CommentShared>> = {

    'project.comment': {
        /**
         * Anyone can post or reply to a comment.
         */
        create: async (call: MaybeAuthenticatedServiceCall<Partial<CommentShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
                return getAuthenticationRequiredView();
            }

            return {
                view: 'verbose'
            }
        },

        /**
         * Only the author of the comment can edit it.
         */
        update: async (call: MaybeAuthenticatedServiceCall<Partial<CommentShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
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
        reply: async (call: MaybeAuthenticatedServiceCall<Partial<CommentShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
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
        delete: async (call: MaybeAuthenticatedServiceCall<Partial<CommentShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
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
            if (comment.userId === call.claims.username) {
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
                view: 'blocked',
                reason: 'User does not have appropriate credentials'
            }
        }
    }
}