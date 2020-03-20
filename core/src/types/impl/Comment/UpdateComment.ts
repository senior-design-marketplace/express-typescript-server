import { CommentShared } from "../../../../../lib/types/shared/CommentShared";

export type UpdateComment =
    | Partial<Pick<CommentShared,
        | 'body'>>