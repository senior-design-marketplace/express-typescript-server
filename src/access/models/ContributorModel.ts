import { Model } from "objection";
import { join } from "path";

export default class ContributorModel extends Model {

	static tableName = "contributors";
    static idColumn = ["projectId", "userId"];

    projectId!: string;
    userId!: string;

    static relationMappings = {

        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: join(__dirname, "UserModel"),
            join: {
                from: "contributors.userId",
                to: "users.id"
            }
        },

        project: {
            relation: Model.BelongsToOneRelation,
            modelClass: join(__dirname, "ProjectModel"),
            join: {
                from: "contributors.projectId",
                to: "projects.id"
            }
        }
    };
}
