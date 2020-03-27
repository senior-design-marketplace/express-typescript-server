import { CommentShared } from "../../../../lib/types/shared/CommentShared";
import { BaseModel } from "./BaseModel";
import { Viewable } from "./Viewable";

export class CommentModel extends BaseModel implements CommentShared, Viewable {

    static tableName = "comments";

    id!: string;
    projectId!: string;
    parentId!: string;
    userId!: string;
    body!: string;
    createdAt!: Date;

    public async getPartialView(): Promise<CommentShared> {
        return this;
    }

    public async getVerboseView(): Promise<CommentShared> {
        return this;
    }

    public async getFullView(): Promise<CommentShared> {
        return this;
    }
}
