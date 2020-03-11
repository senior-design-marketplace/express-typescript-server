import { NotificationMaster } from "../../schemas/types/Notification/NotificationMaster";
import { NotificationModel } from "../models/NotificationModel";
import { NotificationMutable } from "../../schemas/types/Notification/NotificationMutable";

namespace UpdateNotificationAsReadQuery {

    export type Params = {
        resourceId: string;
        payload: NotificationMutable;
    }

    export type Result = NotificationMaster
}

export class UpdateNotificationAsReadQuery {

    public async execute(params: UpdateNotificationAsReadQuery.Params): Promise<UpdateNotificationAsReadQuery.Result> {
        return NotificationModel.query()
            .patchAndFetchById(params.resourceId, params.payload)
            .throwIfNotFound()
            .then(instance => instance.$toJson() as NotificationMaster);
    }
}