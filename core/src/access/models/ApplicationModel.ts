import { Model } from "objection";
import { join } from "path";
import { ApplicationMaster } from "../../schemas/types/Application/ApplicationMaster";
import { StatusType } from "../../schemas/types/Status/StatusType";

export default class ApplicationModel extends Model implements ApplicationMaster {
	static tableName = "applications";

    id!: string;
    createdAt!: Date;
    updatedAt!: Date;
    projectId!: string;
    userId!: string;
    status!: StatusType;
    note!: string;

	static relationMappings = {
		project: {
			relation: Model.BelongsToOneRelation,
			modelClass: join(__dirname, "ProjectModel"),
			join: {
				from: "applications.projectId",
				to: "projects.id"
			}
		},
		appliedBy: {
			relation: Model.BelongsToOneRelation,
			modelClass: join(__dirname, "UserModel"),
			join: {
				from: "applications.userId",
				to: "users.id"
			}
		},
		statusRelation: {
			relation: Model.BelongsToOneRelation,
			modelClass: join(__dirname, "StatusModel"),
			join: {
				from: "applications.status",
				to: "statuses.value"
			}
		}
	};
}
