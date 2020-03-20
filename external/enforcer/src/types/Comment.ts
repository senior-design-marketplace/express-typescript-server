import { CommentModel } from "../models/CommentModel";

export namespace Comment {

    export type PartialView = CommentModel;

    export type VerboseView = CommentModel;

    export type FullView = CommentModel;
}