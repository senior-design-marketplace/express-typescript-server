import { Model } from "objection";
import { join } from "path";

export default class Application extends Model {
	static tableName = "applications";

	readonly id!: string;

	static relationMappings = {
		project: {
			relation: Model.BelongsToOneRelation,
			modelClass: join(__dirname, "project"),
			join: {
				from: "applications.projectId",
				to: "projects.id"
			}
		},
		appliedBy: {
			relation: Model.BelongsToOneRelation,
			modelClass: join(__dirname, "user"),
			join: {
				from: "applications.userId",
				to: "users.id"
			}
		},
		status: {
			relation: Model.BelongsToOneRelation,
			modelClass: join(__dirname, "status"),
			join: {
				from: "applications.statusId",
				to: "statuses.id"
			}
		}
	};
}
