import { Transaction } from "objection";
import { InternalError } from "../../../../core/src/error/error";
import { Role } from "../../../../lib/types/base/Role";
import { Status } from "../../../../lib/types/base/Status";
import { InviteShared } from "../../../../lib/types/shared/InviteShared";
import { BaseModel } from "./BaseModel";
import { Viewable } from "./Viewable";

export class InviteModel extends BaseModel implements InviteShared, Viewable {

    static tableName = "invites";
    
    id!: string;
    initiateId!: string;
    targetId!: string;
    projectId!: string;
    role!: Role;
    status!: Status;
    createdAt!: Date;
    updatedAt!: Date;
    note!: string;

    public async getPartialView(transaction?: Transaction): Promise<InviteShared> {
        throw new InternalError("Not implemented");
    }

    public async getVerboseView(transaction?: Transaction): Promise<InviteShared> {
        return this;
    }

    public async getFullView(transaction?: Transaction): Promise<InviteShared> {
        return this;
    }
}