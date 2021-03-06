import { ApplicationNotification } from "../base/ApplicationNotification";
import { InviteNotification } from "../base/InviteNotification";

export interface NotificationShared {

    /**
     * The id of the notification
     */
    id: string;

    /**
     * The user to which the notification is directed
     */
    userId: string;

    /**
     * Whether or not the user has marked the notification as read
     */
    read: boolean;

    /**
     * The content of the notification
     */
    document: ApplicationNotification | InviteNotification;

    /**
     * When the notification was created
     */
    createdAt: Date
}