import { EventEmitter } from 'events';
import { Actions, EnforcerService, PolicyApplicationFailedError } from '../../../external/enforcer/src/EnforcerService';
import { Resources } from '../../../external/enforcer/src/resources/resources';
import { CreateCommentQuery } from '../access/queries/CreateCommentQuery';
import { DeleteCommentQuery } from '../access/queries/DeleteCommentQuery';
import { AuthorizationError } from '../error/error';
import { CommentImmutable } from '../schemas/types/Comment/CommentImmutable';
import { CommentMaster } from '../schemas/types/Comment/CommentMaster';
import { TranslateErrors } from './decorators';
import * as Utils from './util';

type CreateCommentParams = Utils.AuthenticatedSingleResourceServiceCall<CommentImmutable>;
type ReplyCommentParams = Utils.AuthenticatedNestedResourceServiceCall<CommentImmutable>;
type DeleteCommentParams = Utils.AuthenticatedNestedResourceServiceCall<null>;

export default class CommentService {

    constructor(
        private readonly emitter: EventEmitter,
        private readonly enforcer: EnforcerService<Resources, Actions>,
        private readonly createCommentQuery: CreateCommentQuery,
        private deleteCommentQuery: DeleteCommentQuery) {}

    @TranslateErrors([ PolicyApplicationFailedError ], AuthorizationError)
    public async createComment(params: CreateCommentParams): Promise<CommentMaster> {
        await this.enforcer.enforce(
            params.claims,
            'create',
            'comment',
            params.resourceId
        )

        return this.createCommentQuery.execute({
            id: params.payload.id,
            projectId: params.resourceId,
            userId: params.claims.username,
            body: params.payload.body
        })
    }

    @TranslateErrors([ PolicyApplicationFailedError ], AuthorizationError)
    public async replyComment(params: ReplyCommentParams): Promise<CommentMaster> {
        await this.enforcer.enforce(
            params.claims,
            'create',
            'comment',
            params.outerResourceId,
            params.innerResourceId
        )

        return this.createCommentQuery.execute({
            id: params.payload.id,
            projectId: params.outerResourceId,
            parentId: params.innerResourceId,
            userId: params.claims.username,
            body: params.payload.body
        })
    }

    @TranslateErrors([ PolicyApplicationFailedError ], AuthorizationError)
    public async deleteComment(params: DeleteCommentParams): Promise<void> {
        await this.enforcer.enforce(
            params.claims, 
            'delete', 
            'comment', 
            params.outerResourceId, 
            params.innerResourceId);

        return this.deleteCommentQuery.execute({
            projectId: params.outerResourceId,
            id: params.innerResourceId,
            userId: params.claims.username
        })
    }
}