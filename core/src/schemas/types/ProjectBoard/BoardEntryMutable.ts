import { TextBoardEntry } from './TextBoardEntry';
import { MediaBoardEntry } from './MediaBoardEntry';

export interface BoardEntryMutable {
    /**
     * A wrapper to the entry object
     */
    document?: TextBoardEntry | MediaBoardEntry;
};