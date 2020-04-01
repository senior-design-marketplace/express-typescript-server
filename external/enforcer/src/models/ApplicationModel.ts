import { Transaction } from "objection";
import { InternalError } from "../../../../core/src/error/error";
import { Status } from "../../../../lib/types/base/Status";
import { ApplicationShared } from "../../../../lib/types/shared/ApplicationShared";
import { ViewableModel } from "./ViewableModel";

export class ApplicationModel extends ViewableModel implements ApplicationShared {

	static tableName = "applications";

    id!: string;
    createdAt!: Date;
    updatedAt!: Date;
    projectId!: string;
    userId!: string;
    responderId!: string;
    status!: Status;
    note!: string;

    static modifiers = {
        forProject(query, projectId) {
            query.where("projectId", projectId)
        },
        forUser(query, userId) {
            query.where("userId", userId)
        },
        onlyPending(query) {
            query.where("status", "PENDING")
        }
    }
    
    public async getPartialView(transaction?: Transaction): Promise<ApplicationModel> {
        throw new InternalError("Not implemented");
    }

    public async getVerboseView(): Promise<ApplicationModel> {
        return this;
    }

    public async getFullView(): Promise<ApplicationModel> {
        return this;
    }
}
