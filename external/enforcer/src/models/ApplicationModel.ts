import { Model, Transaction } from "objection";
import { join } from "path";
import { Application } from "../types/Application";
import { Viewable } from "./Viewable";
import { ApplicationShared } from "../../../../lib/types/shared/ApplicationShared";
import { Status } from "../../../../lib/types/base/Status";

export default class ApplicationModel extends Model implements ApplicationShared, Viewable<Application.PartialView, Application.VerboseView, Application.FullView> {
	static tableName = "applications";

    id!: string;
    createdAt!: Date;
    updatedAt!: Date;
    projectId!: string;
    userId!: string;
    status!: Status;
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
    
    public async getPartialView(transaction?: Transaction): Promise<Application.PartialView> {
        throw new Error("Not implemented");
    }

    public async getVerboseView(): Promise<Application.VerboseView> {
        return this;
    }

    public async getFullView(): Promise<Application.FullView> {
        return this;
    }
}
