import { NotificationShared } from "../../../../lib/types/shared/NotificationShared";

export namespace Notification {

    export type PartialView = never;

    export type VerboseView = NotificationShared;

    export type FullView = NotificationShared;
}