import { Model, Transaction } from "objection";
import { Viewable } from "./Viewable";
import { Notification } from "../types/Notification";
import { NotificationShared } from "../../../../lib/types/shared/NotificationShared";
import { ApplicationNotification } from "../../../../lib/types/base/ApplicationNotification";
import { InviteNotification } from "../../../../lib/types/base/InviteNotification";

export class NotificationModel extends Model implements NotificationShared, Viewable<Notification.PartialView, Notification.VerboseView, Notification.FullView> {
    
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

    public async getPartialView(transaction?: Transaction): Promise<Notification.PartialView> {
        throw new Error("Not implemented");
    }

    public async getVerboseView(transaction?: Transaction): Promise<Notification.VerboseView> {
        return this;
    }

    public async getFullView(transaction?: Transaction): Promise<Notification.FullView> {
        return this;
    }
}