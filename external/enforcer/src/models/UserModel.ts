import { Model, Transaction } from "objection";
import { join } from "path";
import { UserShared } from "../../../../lib/types/shared/UserShared";
import { ApplicationModel } from "./ApplicationModel";
import { ProjectModel } from "./ProjectModel";
import { ViewableModel } from "./ViewableModel";

export class UserModel extends ViewableModel implements UserShared {

	static tableName = "users";

    id!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    bio!: string;
    thumbnailLink!: string;
    resumeLink!: string
    joinedAt!: Date;
    roles!: string;

    applications!: ApplicationModel[];
    starred!: ProjectModel[];
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
                    from: "members.contributorId",
                    to: "members.projectId"
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
                    from: "members.administratorId",
                    to: "members.projectId"
                },
                to: "projects.id"
            }
        },
        notifications: {
            relation: Model.HasManyRelation,
            modelClass: join(__dirname, "NotificationModel"),
            join: {
                from: "users.id",
                to: "notifications.userId"
            }
        }
    };
    
    public async getPartialView(transaction?: Transaction): Promise<UserModel> {
        return this;
    }

    public async getVerboseView(transaction?: Transaction): Promise<UserModel> {
        return this.$fetchGraph(`[
            applications,
            starred,
            contributorOn,
            administratorOn.applications(onlyPending) as pendingApplications,
            notifications
        ]`);
    }

    public async getFullView(transaction?: Transaction): Promise<UserModel> {
        return this.getVerboseView();
    }
}
