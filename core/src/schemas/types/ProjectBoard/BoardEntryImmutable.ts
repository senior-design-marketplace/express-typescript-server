import { BoardEntryMutable } from './BoardEntryMutable';
import { TextBoardEntry } from './TextBoardEntry';
import { MediaBoardEntry } from './MediaBoardEntry';

export interface BoardEntryImmutable extends BoardEntryMutable {
    /**
     * A specific identifier for this entry
     * @minLength 1
     * @maxLength 256
     */
    id: string;

    /**
     * A wrapper to the entry object
     */
    document: TextBoardEntry | MediaBoardEntry;

}