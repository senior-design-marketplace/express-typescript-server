import { BoardEntryShared } from "../../../../../lib/types/shared/BoardEntryShared";

export type UpdateBoardEntry =
    | Partial<Pick<BoardEntryShared,
        | 'document'>>