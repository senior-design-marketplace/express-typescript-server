import { NotificationModel } from "../models/NotificationModel";

export namespace Notification {

    export type PartialView = never;

    export type VerboseView = NotificationModel;

    export type FullView = NotificationModel;
}