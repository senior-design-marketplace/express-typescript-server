import { Role } from "../base/Role";
import { Status } from "../base/Status";

export interface InviteShared {
    
    /**
     * The id of the invite
     */
    id: string;

    /**
     * The id of the user who initiated the invite
     */
    initiateId: string;

    /**
     * The id of the user targeted by the invite
     */
    targetId: string;

    /**
     * The project to which the target is being invited
     */
    projectId: string;

    /**
     * The role that the target will be elevated to
     */
    role: Role;

    /**
     * The current status of the invite
     */
    status: Status;

    /**
     * When the invite was created
     */
    createdAt: Date;

    /**
     * When the invite was last updated
     */
    updatedAt: Date;

    /**
     * A note included with the invite
     */
    note: string;
}