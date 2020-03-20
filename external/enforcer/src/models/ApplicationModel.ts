import { Model, Transaction } from "objection";
import { Application } from "../types/Application";
import { Viewable } from "./Viewable";
import { ApplicationShared } from "../../../../lib/types/shared/ApplicationShared";
import { Status } from "../../../../lib/types/base/Status";
import { InternalError } from "../../../../core/src/error/error";
import { BaseModel } from "./BaseModel";

export class ApplicationModel extends BaseModel implements ApplicationShared, Viewable<Application.PartialView, Application.VerboseView, Application.FullView> {

	static tableName = "applications";

    id!: string;
    createdAt!: Date;
    updatedAt!: Date;
    projectId!: string;
    userId!: string;
    status!: Status;
    note!: string;
    
    public async getPartialView(transaction?: Transaction): Promise<Application.PartialView> {
        throw new InternalError("Not implemented");
    }

    public async getVerboseView(): Promise<Application.VerboseView> {
        return this;
    }

    public async getFullView(): Promise<Application.FullView> {
        return this;
    }
}
