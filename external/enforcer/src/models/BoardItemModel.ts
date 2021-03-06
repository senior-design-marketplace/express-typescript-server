import { Model } from "objection";
import { join } from "path";
import { Viewable } from "./Viewable";
import { BoardEntry } from "../types/BoardEntry";
import { BoardEntryShared } from "../../../../lib/types/shared/BoardEntryShared";
import { TextBoardEntry } from "../../../../lib/types/base/TextBoardEntry";
import { MediaBoardEntry } from "../../../../lib/types/base/MediaBoardEntry";
import { BaseModel } from "./BaseModel";

export class BoardItemModel extends BaseModel implements BoardEntryShared, Viewable {

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

    public async getPartialView(): Promise<BoardEntryShared> {
        return this;
    }

    public async getVerboseView(): Promise<BoardEntryShared> {
        return this;
    }

    public async getFullView(): Promise<BoardEntryShared> {
        return this;
    }
}
