import { BoardEntryShared } from "../../../../../lib/types/shared/BoardEntryShared";

export type CreateBoardEntry =
    | Pick<BoardEntryShared, 
        | 'id' 
        |'document'>