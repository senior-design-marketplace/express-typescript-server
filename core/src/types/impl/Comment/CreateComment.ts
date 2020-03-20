import { CommentShared } from "../../../../../lib/types/shared/CommentShared";

export type CreateComment =
    | Pick<CommentShared,
        | 'id'
        | 'body'>