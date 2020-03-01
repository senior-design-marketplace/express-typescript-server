import { InviteMaster } from "../../schemas/types/Invite/InviteMaster";
import { Model } from "objection";
import { RoleType } from "../../schemas/types/Role/RoleType";
import { StatusType } from "../../schemas/types/Status/StatusType";

export default class InviteModel extends Model implements InviteMaster {

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
    role!: RoleType;
    status!: StatusType;
    createdAt!: Date;
    updatedAt!: Date;
    note!: string;

    // relations
    static get relationMappings() {
        return {

        }
    }
}