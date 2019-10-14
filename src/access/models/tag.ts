import { Model } from "objection";
import { join } from "path";

export default class Tag extends Model {
	static tableName = "tagsValues";

	readonly id!: string;

	static relationMappings = {
		taggedOn: {
			relation: Model.ManyToManyRelation,
			modelClass: join(__dirname, "project"),
			join: {
				from: "tagsValues.value",
				through: {
					//tags is the join table
					from: "tags.tag",
					to: "tags.projectId"
				},
				to: "projects.id"
			}
		}
	};
}
