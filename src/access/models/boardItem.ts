import { Model } from "objection";
import { join } from "path";

export default class BoardItem extends Model {
	static tableName = "boardItems";

	readonly id!: string;

	static relationMappings = {
		postedOn: {
			relation: Model.BelongsToOneRelation,
			modelClass: join(__dirname, "project"),
			join: {
				from: "boardItems.projectId",
				to: "projects.id"
			}
		}
	};
}
