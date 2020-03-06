import * as Utils from './util';
import { CommentImmutable } from '../schemas/types/Comment/CommentImmutable';
import { CommentMaster } from '../schemas/types/Comment/CommentMaster';
import { EventEmitter } from 'events';
import { CreateCommentQuery } from '../access/queries/CreateCommentQuery';

type CreateCommentParams = Utils.AuthenticatedSingleResourceServiceCall<CommentImmutable>;
type ReplyCommentParams = Utils.AuthenticatedNestedResourceServiceCall<CommentImmutable>;

export default class CommentService {

    constructor(
        private readonly emitter: EventEmitter,
        private readonly createCommentQuery: CreateCommentQuery) {}

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
}