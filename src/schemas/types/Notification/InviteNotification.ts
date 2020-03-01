import { InviteMaster } from "../Invite/InviteMaster";

export interface InviteNotification {
    /**
     * A typing flag to denote the format of the entry
     */
    type: "INVITE";

    /**
     * The content of the invite
     */
    invite: InviteMaster;
}