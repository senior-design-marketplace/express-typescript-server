import CommentModel from "../models/CommentModel";

namespace DeleteCommentQuery {

    export type Params = {
        id: string;
        projectId: string;
        userId: string;
    }
}

export class DeleteCommentQuery {

    public async execute(params: DeleteCommentQuery.Params): Promise<void> {
        await CommentModel.query()
            .deleteById(params.id)
            .throwIfNotFound();
    }
}