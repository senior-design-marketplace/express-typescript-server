import { Role } from "./Role";

export interface Membership {

    /**
     * The role of a user in a project.
     */
    role: Role,

    /**
     * Whether or not this user represents
     * an advisor.  This flag is kept separate
     * to allow an advisor to participate as a
     * contributor.
     */
    isAdvisor: boolean
}