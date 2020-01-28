import { Model } from "objection";
import { join } from "path";

export default class Administrator extends Model {

	static tableName = "administrators";
    static idColumn = ["projectId", "userId"];

    static relationMappings = {

        // junction tables will typically have a
        // belongs to one relation, unless there is
        // extra information kept alongside
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
