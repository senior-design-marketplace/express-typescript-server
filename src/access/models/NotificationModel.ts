import { NotificationMaster } from "../../schemas/types/Notification/NotificationMaster";
import { Model } from "objection";
import { ApplicationNotification } from "../../schemas/types/Notification/ApplicationNotification";
import { InviteNotification } from "../../schemas/types/Notification/InviteNotification";

export class NotificationModel extends Model implements NotificationMaster {

    static get tableName() {
        return 'notifications';
    }

    static get idColumn() {
        return 'id';
    }

    id!: string;
    userId!: string;
    read!: boolean;
    document!: ApplicationNotification | InviteNotification;
    createdAt!: Date;
    
}