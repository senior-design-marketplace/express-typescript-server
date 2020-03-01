import { BoardEntryImmutable } from './BoardEntryImmutable';
import { TextBoardEntry } from './TextBoardEntry';
import { MediaBoardEntry } from './MediaBoardEntry';

export interface BoardEntryMaster extends BoardEntryImmutable {
    /**
     * A wrapper to the entry object
     */
    entry: TextBoardEntry | MediaBoardEntry;

    /**
     * The project that this entry belongs to
     * @minLength 1
     * @maxLength 256
     */
    projectId: string;

    /**
     * A specific identifier for this entry
     * @minLength 1
     * @maxLength 256
     */
    entryId: string;

    /**
     * The last time the entry was updated
     */
    updatedAt: Date;
}