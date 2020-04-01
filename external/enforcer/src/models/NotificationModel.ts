import { Transaction } from "objection";
import { InternalError } from "../../../../core/src/error/error";
import { ApplicationNotification } from "../../../../lib/types/base/ApplicationNotification";
import { InviteNotification } from "../../../../lib/types/base/InviteNotification";
import { NotificationShared } from "../../../../lib/types/shared/NotificationShared";
import { ViewableModel } from "./ViewableModel";

export class NotificationModel extends ViewableModel implements NotificationShared {
    
    static tableName = "notifications";

    id!: string;
    userId!: string;
    read!: boolean;
    document!: ApplicationNotification | InviteNotification;
    createdAt!: Date;

    public async getPartialView(transaction?: Transaction): Promise<NotificationModel> {
        throw new InternalError("Not implemented");
    }

    public async getVerboseView(transaction?: Transaction): Promise<NotificationModel> {
        return this;
    }

    public async getFullView(transaction?: Transaction): Promise<NotificationModel> {
        return this;
    }
}