import { Claims } from "../../../../core/src/auth/verify";
import { NotificationModel } from "../models/NotificationModel";
import { Actions, Policy } from "../Enforcer";
import { Resources } from "../resources/resources";
import { getResourceMismatchView, getAuthenticationRequiredView } from "./util";

export const NotificationPolicy: Policy<Resources, Actions> = {

    'user.notification': {
        /**
         * A user can only access their own notifications.
         */
        describe: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return getAuthenticationRequiredView();
            }

            const userId = resourceIds[0];
            const notificationId = resourceIds[1];

            const notification = await NotificationModel.query()
                .findById(notificationId)
                .throwIfNotFound();

            if (notification.userId !== userId) {
                return getResourceMismatchView(userId, notificationId);
            }

            if (userId === claims.username) {
                return {
                    view: 'verbose'
                }
            }

            return {
                view: 'hidden'
            }
        },

        /**
         * A user can only update their own notifications.
         */
        update: async (claims?: Claims, ...resourceIds: string[]) => {
            if (!claims) {
                return getAuthenticationRequiredView();
            }
            
            const userId = resourceIds[0];
            const notificationId = resourceIds[1];

            const notification = await NotificationModel.query()
                .findById(notificationId)
                .throwIfNotFound();

            if (notification.userId !== userId) {
                return getResourceMismatchView(userId, notificationId);
            }

            if (userId === claims.username) {
                return {
                    view: 'verbose'
                }
            }

            return {
                view: 'hidden'
            }
        }
    }
}