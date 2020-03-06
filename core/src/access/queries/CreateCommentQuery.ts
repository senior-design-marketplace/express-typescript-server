import { CommentMaster } from "../../schemas/types/Comment/CommentMaster"
import CommentModel from "../models/CommentModel"
import { CommentImmutable } from "../../schemas/types/Comment/CommentImmutable"

namespace CreateCommentQuery {

    export type Params = {
        projectId: string;
        parentId?: string;
        userId: string;
    } & CommentImmutable;

    export type Result = CommentMaster;
}

export class CreateCommentQuery {

    public async execute(params: CreateCommentQuery.Params): Promise<CreateCommentQuery.Result> {
        try {
            await CommentModel.query()
                .insert(params)
        } catch (e) {
            console.warn(e);
        } finally {
            return CommentModel.query()
                .findById(params.id)
                .throwIfNotFound()
                .then((instance) => instance.$toJson() as CommentMaster);
        }
    }
}
