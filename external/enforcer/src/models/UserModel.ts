import { Model, Transaction } from "objection";
import { join } from "path";
import { ApplicationModel } from "./ApplicationModel";
import { ProjectModel } from "./ProjectModel";
import { Viewable } from "./Viewable";
import { UserShared } from "../../../../lib/types/shared/UserShared";
import { User } from "../types/User";
import { BaseModel } from "./BaseModel";

export class UserModel extends BaseModel implements UserShared, Viewable<User.PartialView, User.VerboseView, User.FullView> {

	static tableName = "users";

    id!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    bio!: string;
    thumbnailLink!: string;
    joinedAt!: Date;
    roles!: string;

    applications!: ApplicationModel[];
    stars!: ProjectModel[];
    contributorOn!: ProjectModel[];
    administratorOn!: ProjectModel[];

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
		starred: {
			relation: Model.ManyToManyRelation,
			modelClass: join(__dirname, "ProjectModel"),
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
    
    public async getPartialView(transaction?: Transaction): Promise<User.PartialView> {
        return this;
    }

    public async getVerboseView(transaction?: Transaction): Promise<User.VerboseView> {
        return this.$fetchGraph(`[
            applications,
            starred,
            contributorOn,
            administratorOn
        ]`)
    }

    public async getFullView(transaction?: Transaction): Promise<User.FullView> {
        return this.$fetchGraph(`[
            applications,
            starred,
            contributorOn,
            administratorOn
        ]`)
    }
}
