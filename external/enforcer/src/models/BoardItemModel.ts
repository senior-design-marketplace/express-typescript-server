import { MediaBoardEntry } from "../../../../lib/types/base/MediaBoardEntry";
import { TextBoardEntry } from "../../../../lib/types/base/TextBoardEntry";
import { BoardEntryShared } from "../../../../lib/types/shared/BoardEntryShared";
import { ViewableModel } from "./ViewableModel";

export class BoardItemModel extends ViewableModel implements BoardEntryShared {

	static tableName = "boardItems";

    id!: string;
    userId!: string;
    projectId!: string;
    document!: TextBoardEntry | MediaBoardEntry;
    createdAt!: Date;
    updatedAt!: Date;
    
    static modifiers = {
        mostRecent(query) {
            query.orderBy('createdAt', 'desc');
        }
    }

    public async getPartialView(): Promise<BoardItemModel> {
        return this;
    }

    public async getVerboseView(): Promise<BoardItemModel> {
        return this;
    }

    public async getFullView(): Promise<BoardItemModel> {
        return this;
    }
}
