import { Model, Transaction } from "objection";
import { Invite } from "../types/Invite";
import { Viewable } from "./Viewable";
import { InviteShared } from "../../../../lib/types/shared/InviteShared";
import { Role } from "../../../../lib/types/base/Role";
import { Status } from "../../../../lib/types/base/Status";

export default class InviteModel extends Model implements InviteShared, Viewable<Invite.PartialView, Invite.VerboseView, Invite.FullView> {

    static get tableName() {
        return 'invites';
    }

    static get idColumn() {
        return 'id';
    }
    
    id!: string;
    initiateId!: string;
    targetId!: string;
    projectId!: string;
    role!: Role;
    status!: Status;
    createdAt!: Date;
    updatedAt!: Date;
    note!: string;

    // relations
    static get relationMappings() {
        return {

        }
    }

    public async getPartialView(transaction?: Transaction): Promise<Invite.PartialView> {
        throw new Error("Not implemented");
    }

    public async getVerboseView(transaction?: Transaction): Promise<Invite.VerboseView> {
        return this;
    }

    public async getFullView(transaction?: Transaction): Promise<Invite.FullView> {
        return this;
    }
}