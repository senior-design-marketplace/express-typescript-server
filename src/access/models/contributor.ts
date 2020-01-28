import { Model } from "objection";
import { join } from "path";

export default class Contributor extends Model {

	static tableName = "contributors";
    static idColumn = ["projectId", "userId"];

    static relationMappings = {

        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: join(__dirname, "user"),
            join: {
                from: "administrators.userId",
                to: "users.id"
            }
        },

        project: {
            relation: Model.BelongsToOneRelation,
            modelClass: join(__dirname, "project"),
            join: {
                from: "administrators.projectId",
                to: "projects.id"
            }
        }
	};
}
