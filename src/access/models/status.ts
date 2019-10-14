import { Model } from "objection";
import { join } from "path";

export default class Status extends Model {
	static tableName = "statuses";

	readonly id!: string;

	static relationMappings = {
		requests: {
			relation: Model.HasManyRelation,
			modelClass: join(__dirname, "request"),
			join: {
				from: "statuses.id",
				to: "requests.statusId"
			}
		},
		applications: {
			relation: Model.HasManyRelation,
			modelClass: join(__dirname, "application"),
			join: {
				from: "statuses.id",
				to: "applications.statusId"
			}
		}
	};
}
