import { NotificationShared } from "../../../../../lib/types/shared/NotificationShared";

export type UpdateNotification =
    | Partial<Pick<NotificationShared,
        | 'read'>>