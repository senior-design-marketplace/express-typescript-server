import { Model } from "objection";
import { Viewable } from "./Viewable";
import { Comment } from "../types/Comment";
import { CommentShared } from "../../../../lib/types/shared/CommentShared";

export class CommentModel extends Model implements CommentShared, Viewable<Comment.PartialView, Comment.VerboseView, Comment.FullView> {

    static tableName = "comments";

    id!: string;
    projectId!: string;
    parentId!: string;
    userId!: string;
    body!: string;
    createdAt!: Date;

    public async getPartialView(): Promise<Comment.PartialView> {
        return this;
    }

    public async getVerboseView(): Promise<Comment.VerboseView> {
        return this;
    }

    public async getFullView(): Promise<Comment.FullView> {
        return this;
    }
}
