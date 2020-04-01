import { Transaction } from "objection";
import { InternalError } from "../../../../core/src/error/error";
import { Role } from "../../../../lib/types/base/Role";
import { Status } from "../../../../lib/types/base/Status";
import { InviteShared } from "../../../../lib/types/shared/InviteShared";
import { ViewableModel } from "./ViewableModel";

export class InviteModel extends ViewableModel implements InviteShared {

    static tableName = "invites";
    
    id!: string;
    initiateId!: string;
    targetId!: string;
    projectId!: string;
    role!: Role;
    isAdvisor!: boolean;
    status!: Status;
    createdAt!: Date;
    updatedAt!: Date;
    note!: string;

    public async getPartialView(transaction?: Transaction): Promise<InviteModel> {
        throw new InternalError("Not implemented");
    }

    public async getVerboseView(transaction?: Transaction): Promise<InviteModel> {
        return this;
    }

    public async getFullView(transaction?: Transaction): Promise<InviteModel> {
        return this;
    }
}