import { Model } from "objection";
import { join } from "path";
import { CommentMaster } from "../../schemas/types/Comment/CommentMaster";

export default class CommentModel extends Model implements CommentMaster {
    static tableName = "comments";

    id!: string;
    projectId!: string;
    parentId!: string;
    userId!: string;
    body!: string;
    createdAt!: Date;
}
