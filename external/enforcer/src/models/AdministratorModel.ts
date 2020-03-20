import { Model } from "objection";
import { join } from "path";

export default class AdministratorModel extends Model {

	static tableName = "administrators";
    static idColumn = ["projectId", "userId"];

    projectId!: string;
    userId!: string;
    isAdvisor!: boolean;

    /**
     * Should have a flag here to denote whether the
     * admininstrator status is due to being an
     * advisor or not.  That way, we can consolidate
     * the administrator and advisor tables.
     */

    static relationMappings = {

        // junction tables will typically have a
        // belongs to one relation, unless there is
        // extra information kept alongside
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: join(__dirname, "UserModel"),
            join: {
                from: "administrators.userId",
                to: "users.id"
            }
        },

        project: {
            relation: Model.BelongsToOneRelation,
            modelClass: join(__dirname, "ProjectModel"),
            join: {
                from: "administrators.projectId",
                to: "projects.id"
            }
        }
    };
    
    static add(projectId: string, userId: string) {
        AdministratorModel.query()
            .insert({ projectId, userId });
    }

    static remove(projectId: string, userId: string) {
        AdministratorModel.query()
            .for([projectId, userId])
            .delete();
    }
    
    static async isAdministrator(projectId: string, userId: string) {
        return Boolean(await AdministratorModel.query()
            .for([projectId, userId])
            .resultSize());
    }
}
