import { Model } from "objection";
import { join } from "path";

export default class StatusModel extends Model {
	static tableName = "statuses";

	readonly id!: string;

	static relationMappings = {
		applications: {
			relation: Model.HasManyRelation,
			modelClass: join(__dirname, "ApplicationModel"),
			join: {
				from: "statuses.id",
				to: "applications.statusId"
			}
		}
	};
}
