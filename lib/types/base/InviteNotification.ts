import { InviteShared } from "../shared/InviteShared";

export interface InviteNotification {

    /**
     * A typing flag to denote the format of the entry
     */
    type: "INVITE";

    /**
     * The content of the invite
     */
    invite: InviteShared;
}