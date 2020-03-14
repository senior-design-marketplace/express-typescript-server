import * as Utils from './util';
import { CommentImmutable } from '../schemas/types/Comment/CommentImmutable';
import { CommentMaster } from '../schemas/types/Comment/CommentMaster';
import { EventEmitter } from 'events';
import { CreateCommentQuery } from '../access/queries/CreateCommentQuery';
import { DeleteCommentQuery } from '../access/queries/DeleteCommentQuery';
import { EnforcerService, Resources, CRUDActions } from './enforcer/EnforcerService';

type CreateCommentParams = Utils.AuthenticatedSingleResourceServiceCall<CommentImmutable>;
type ReplyCommentParams = Utils.AuthenticatedNestedResourceServiceCall<CommentImmutable>;
type DeleteCommentParams = Utils.AuthenticatedNestedResourceServiceCall<null>;

export default class CommentService {

    constructor(
        private readonly emitter: EventEmitter,
        private readonly enforcer: EnforcerService<CRUDActions, Resources>,
        private readonly createCommentQuery: CreateCommentQuery,
        private deleteCommentQuery: DeleteCommentQuery) {}

    public async createComment(params: CreateCommentParams): Promise<CommentMaster> {
        return this.createCommentQuery.execute({
            id: params.payload.id,
            projectId: params.resourceId,
            userId: params.claims.username,
            body: params.payload.body
        })
    }

    public async replyComment(params: ReplyCommentParams): Promise<CommentMaster> {
        return this.createCommentQuery.execute({
            id: params.payload.id,
            projectId: params.outerResourceId,
            parentId: params.innerResourceId,
            userId: params.claims.username,
            body: params.payload.body
        })
    }

    public async deleteComment(params: DeleteCommentParams): Promise<void> {
        await this.enforcer.enforce(
            params.claims, 
            'delete', 
            'comment', 
            params.outerResourceId, 
            params.innerResourceId);

        await this.deleteCommentQuery.execute({
            projectId: params.outerResourceId,
            id: params.innerResourceId,
            userId: params.claims.username
        })
    }
}