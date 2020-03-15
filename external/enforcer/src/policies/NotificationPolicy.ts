import { Claims } from "../../../../core/src/access/auth/verify";
import { NotificationModel } from "../../../../core/src/access/models/NotificationModel";
import { Actions, Policy } from "../EnforcerService";
import { Resources } from "../resources/resources";

export const NotificationPolicy: Policy<Resources, Actions> = {

    'notification': {
        /**
         * A user can only access their own notifications.
         */
        read: async (claims: Claims, ...resourceIds: string[]) => {
            const userId = resourceIds[0];
            const notificationId = resourceIds[1];

            const notification = await NotificationModel.query()
                .findById(notificationId)
                .throwIfNotFound();

            if (notification.userId !== userId) {
                return false;
            }

            return userId === claims.username;
        },

        /**
         * A user can only update their own notifications.
         */
        update: async (claims: Claims, ...resourceIds: string[]) => {
            const userId = resourceIds[0];
            const notificationId = resourceIds[1];

            const notification = await NotificationModel.query()
                .findById(notificationId)
                .throwIfNotFound();

            if (notification.userId !== userId) {
                return false;
            }

            return userId === claims.username;
        }
    }
}