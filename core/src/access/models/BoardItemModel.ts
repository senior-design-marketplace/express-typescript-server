import { Model } from "objection";
import { join } from "path";
import { BoardEntryMaster } from "../../schemas/types/ProjectBoard/BoardEntryMaster";
import { TextBoardEntry } from "../../schemas/types/ProjectBoard/TextBoardEntry";
import { MediaBoardEntry } from "../../schemas/types/ProjectBoard/MediaBoardEntry";

export default class BoardItemModel extends Model implements BoardEntryMaster {
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
}
