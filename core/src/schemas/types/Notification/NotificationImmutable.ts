import { NotificationMutable } from "./NotificationMutable";
import { ApplicationNotification } from "./ApplicationNotification";
import { InviteNotification } from "./InviteNotification";

export interface NotificationImmutable extends NotificationMutable {
    /**
     * The id of the notification
     */
    id: string;

    /**
     * The user to which the notification is directed
     */
    userId: string;

    /**
     * The content of the notification
     */
    document: ApplicationNotification | InviteNotification;
}