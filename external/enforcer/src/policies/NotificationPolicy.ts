import { NotificationShared } from "../../../../lib/types/shared/NotificationShared";
import { Actions, Policy } from "../Enforcer";
import { MaybeAuthenticatedServiceCall } from "../EnforcerService";
import { NotificationModel } from "../models/NotificationModel";
import { Resources } from "../resources/resources";
import { getAuthenticationRequiredView, getResourceMismatchView } from "./util";

export const NotificationPolicy: Policy<Resources, Actions, Partial<NotificationShared>> = {

    'user.notification': {
        /**
         * A user can only access their own notifications.
         */
        describe: async (call: MaybeAuthenticatedServiceCall<Partial<NotificationShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
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

            if (userId === call.claims.username) {
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
        update: async (call: MaybeAuthenticatedServiceCall<Partial<NotificationShared>>, ...resourceIds: string[]) => {
            if (!call.claims) {
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

            if (userId === call.claims.username) {
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