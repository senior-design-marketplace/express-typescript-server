import { Model } from "objection";
import { join } from "path";
import { UserMaster } from "../../schemas/types/User/UserMaster";
import ApplicationModel from "./ApplicationModel";
import ProjectModel from "./ProjectModel";

export default class UserModel extends Model implements UserMaster {
	static tableName = "users";

    readonly id!: string;
    readonly bio!: string;
    readonly thumbnailLink!: string;

    readonly applications!: ApplicationModel[];
    readonly stars!: ProjectModel[];
    readonly contributorOn!: ProjectModel[];
    readonly administratorOn!: ProjectModel[];

	static relationMappings = {
		//one-to-many
		applications: {
			relation: Model.HasManyRelation,
			modelClass: join(__dirname, "ApplicationModel"),
			join: {
				from: "users.id",
				to: "applications.userId"
			}
		},

		//many-to-many
		stars: {
			relation: Model.ManyToManyRelation,
			modelClass: join(__dirname, "UserModel"),
			join: {
				from: "users.id",
				through: {
					from: "stars.userId",
					to: "stars.projectId"
				},
				to: "projects.id"
			}
		},
		contributorOn: {
			relation: Model.ManyToManyRelation,
			modelClass: join(__dirname, "ProjectModel"),
			join: {
				from: "users.id",
				through: {
					from: "contributors.userId",
					to: "contributors.projectId"
				},
                to: "projects.id"
			}
		},
		administratorOn: {
			relation: Model.ManyToManyRelation,
			modelClass: join(__dirname, "ProjectModel"),
			join: {
				from: "users.id",
				through: {
					from: "administrators.userId",
					to: "administrators.projectId"
				},
				to: "projects.id"
			}
		}
	};
}
