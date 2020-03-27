import { Transaction } from "objection";
import { InternalError } from "../../../../core/src/error/error";
import { ApplicationNotification } from "../../../../lib/types/base/ApplicationNotification";
import { InviteNotification } from "../../../../lib/types/base/InviteNotification";
import { NotificationShared } from "../../../../lib/types/shared/NotificationShared";
import { BaseModel } from "./BaseModel";
import { Viewable } from "./Viewable";

export class NotificationModel extends BaseModel implements NotificationShared, Viewable {
    
    static tableName = "notifications";

    id!: string;
    userId!: string;
    read!: boolean;
    document!: ApplicationNotification | InviteNotification;
    createdAt!: Date;

    public async getPartialView(transaction?: Transaction): Promise<NotificationShared> {
        throw new InternalError("Not implemented");
    }

    public async getVerboseView(transaction?: Transaction): Promise<NotificationShared> {
        return this;
    }

    public async getFullView(transaction?: Transaction): Promise<NotificationShared> {
        return this;
    }
}