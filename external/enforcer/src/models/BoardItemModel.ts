import { Model } from "objection";
import { join } from "path";
import { Viewable } from "./Viewable";
import { BoardEntry } from "../types/BoardEntry";
import { BoardEntryShared } from "../../../../lib/types/shared/BoardEntryShared";
import { TextBoardEntry } from "../../../../lib/types/base/TextBoardEntry";
import { MediaBoardEntry } from "../../../../lib/types/base/MediaBoardEntry";

export default class BoardItemModel extends Model implements BoardEntryShared, Viewable<BoardEntry.PartialView, BoardEntry.VerboseView, BoardEntry.FullView> {
	static tableName = "boardItems";

    readonly id!: string;
    readonly userId!: string;
    readonly projectId!: string;
    readonly document!: TextBoardEntry | MediaBoardEntry;
    readonly createdAt!: Date;
    readonly updatedAt!: Date;

	static relationMappings = {
		postedOn: {
			relation: Model.BelongsToOneRelation,
			modelClass: join(__dirname, "ProjectModel"),
			join: {
				from: "boardItems.projectId",
				to: "projects.id"
			}
		}
    };
    
    static modifiers = {
        mostRecent(query) {
            query.orderBy('createdAt', 'desc');
        }
    }

    public async getPartialView(): Promise<BoardEntry.PartialView> {
        return this;
    }

    public async getVerboseView(): Promise<BoardEntry.VerboseView> {
        return this;
    }

    public async getFullView(): Promise<BoardEntry.FullView> {
        return this;
    }
}
