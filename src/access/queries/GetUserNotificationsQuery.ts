import { NotificationMaster } from "../../schemas/types/Notification/NotificationMaster";
import { NotificationModel } from "../models/NotificationModel";

namespace GetUserNotificationsQuery {

    export type Params = {
        userId: string;
    }

    export type Result = NotificationMaster[];
}

export class GetUserNotificationsQuery {

    public async execute(params: GetUserNotificationsQuery.Params): Promise<GetUserNotificationsQuery.Result> {
        return NotificationModel.query()
            .where('userId', params.userId)
            .orderBy('createdAt')
            .then((instances) => instances.map((instance) => instance.$toJson() as NotificationMaster));
    }
}