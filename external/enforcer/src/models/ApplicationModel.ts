import { Transaction } from "objection";
import { InternalError } from "../../../../core/src/error/error";
import { Status } from "../../../../lib/types/base/Status";
import { ApplicationShared } from "../../../../lib/types/shared/ApplicationShared";
import { BaseModel } from "./BaseModel";
import { Viewable } from "./Viewable";

export class ApplicationModel extends BaseModel implements ApplicationShared, Viewable {

	static tableName = "applications";

    id!: string;
    createdAt!: Date;
    updatedAt!: Date;
    projectId!: string;
    userId!: string;
    responderId!: string;
    status!: Status;
    note!: string;
    
    public async getPartialView(transaction?: Transaction): Promise<ApplicationShared> {
        throw new InternalError("Not implemented");
    }

    public async getVerboseView(): Promise<ApplicationShared> {
        return this;
    }

    public async getFullView(): Promise<ApplicationShared> {
        return this;
    }
}
