import { CommentImmutable } from "./CommentImmutable";

export interface CommentMaster extends CommentImmutable {
    /**
     * An identifier for this comment
     */
    id: string;

    /**
     * The project that the comment appears on
     */
    projectId: string;

    /**
     * The id of the comment that this replies to
     */
    parentId: string;

    /**
     * The id of the user that posted the comment
     */
    userId: string;

    /**
     * The content of the comment
     * @minLength 1
     * @maxLength 256
     */
    body: string;

    /**
     * When this comment was posted
     */
    createdAt: Date
}