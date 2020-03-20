import { TextBoardEntry } from "../base/TextBoardEntry";
import { MediaBoardEntry } from "../base/MediaBoardEntry";

export interface BoardEntryShared {
    
    /**
     * A specific identifier for this entry
     * @minLength 1
     * @maxLength 256
     */
    id: string;

    /**
     * The id of the user that created the entry
     * @minLength 1
     * @maxLength 256
     */
    userId: string;

    /**
     * The project that this entry belongs to
     * @minLength 1
     * @maxLength 256
     */
    projectId: string;

    /**
     * A wrapper to the entry object
     */
    document: TextBoardEntry | MediaBoardEntry;

    /**
     * The last time the entry was updated
     */
    updatedAt: Date;
}