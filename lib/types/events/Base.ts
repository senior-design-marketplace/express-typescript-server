import { UserShared } from "../shared/UserShared"

export type Event =
    | "APPLICATION_CREATED"
    | "APPLICATION_DELETED"
    | "APPLICATION_ACCEPTED"
    | "APPLICATION_REJECTED"
    | "INVITE_CREATED"
    | "INVITE_DELETED"
    | "INVITE_ACCEPTED"
    | "INVITE_REJECTED"
    | "ENTRY_CREATED"
    | "ENTRY_UPDATED"
    | "ENTRY_DELETED"
    | "MEMBER_JOINED"
    | "MEMBER_LEFT"
    | "MEMBER_PROMOTED"
    | "MEMBER_DEMOTED"
    | "COVER_UPDATED"
    | "AVATAR_UPDATED"
    | "PROJECT_CREATED"
    | "PROJECT_UPDATED"
    | "PROJECT_DELETED"
    