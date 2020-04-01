import { CommentShared } from "../../../../lib/types/shared/CommentShared";
import { ViewableModel } from "./ViewableModel";

export class CommentModel extends ViewableModel implements CommentShared {

    static tableName = "comments";

    id!: string;
    projectId!: string;
    parentId!: string;
    userId!: string;
    body!: string;
    createdAt!: Date;

    public async getPartialView(): Promise<CommentModel> {
        return this;
    }

    public async getVerboseView(): Promise<CommentModel> {
        return this;
    }

    public async getFullView(): Promise<CommentModel> {
        return this;
    }
}
