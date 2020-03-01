import { BoardEntryMutable } from './BoardEntryMutable';
import { TextBoardEntry } from './TextBoardEntry';
import { MediaBoardEntry } from './MediaBoardEntry';

export interface BoardEntryImmutable extends BoardEntryMutable {
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
     * A wrapper to the entry object
     */
    entry: TextBoardEntry | MediaBoardEntry;

}