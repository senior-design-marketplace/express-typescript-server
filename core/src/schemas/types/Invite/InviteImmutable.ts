import { RoleType } from "../Role/RoleType";

export interface InviteImmutable {
    /**
     * The id of the invite
     */
    id: string;
    
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
    role: RoleType;

    /**
     * A note included with the invite
     */
    note?: string;
}