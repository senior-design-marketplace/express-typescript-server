import { Event } from  "./Base";

export type NotificationEvent = Extract<Event,
    | "APPLICATION_ACCEPTED"
    | "APPLICATION_REJECTED"
    | "INVITE_ACCEPTED"
    | "INVITE_REJECTED"
    | "MEMBER_JOINED"
    | "MEMBER_LEFT"
    | "PROJECT_DELETED">