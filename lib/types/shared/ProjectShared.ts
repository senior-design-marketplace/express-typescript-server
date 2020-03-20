import { BoardEntryShared } from "./BoardEntryShared";
import { ApplicationShared } from "./ApplicationShared";
import { UserShared } from "./UserShared";
import { TagShared } from "./TagShared";
import { MajorShared } from "./MajorShared";

export interface ProjectShared {

    /**
     * A unique identifier for this project
     * @format uuid
     */
    id: string;

    /**
     * The title of the project
     * @minLength 1
     * @maxLength 256
     */
    title: string;

    /**
     * A short description of the project
     * @minLength 1
     * @maxLength 256
     */
    tagline: string;

    /**
     * A longer description of the project
     * @minLength 1
     * @maxLength 2048
     */
    body: string;

    /**
     * A flag set by the advisor to prevent or enable further applications
     */
    acceptingApplications: boolean;

    /**
     * A link to a large banner picture of the project
     * @minLength 1
     * @maxLength 256
     */
    coverLink: string;

    /**
     * A link to a small picture to represent the project
     * @minLength 1
     * @maxLength 256
     */
    thumbnailLink: string;

    // /**
    //  * Entries on the project board of a project
    //  * @minItems 0
    //  */
    // boardItems: BoardEntryShared[];

    // /**
    //  * Applications to the project
    //  * @minItems 0
    //  */
    // applications: ApplicationShared[];

    // /**
    //  * People who are working on the project
    //  * @minItems 0
    //  */
    // contributors: UserShared[];

    // /**
    //  * Contributors with elevated privileges
    //  * @minItems 0
    //  */
    // administrators: UserShared[];

    // /**
    //  * Tags associated with the project
    //  * @minItems 0
    //  */
    // tags: TagShared[];

    // /**
    //  * Majors of students that are needed for the project
    //  * @minItems 0
    //  */
    // requestedMajors: MajorShared[];

    // /**
    //  * Users that have starred this project
    //  * @minItems 0
    //  */
    // starredBy: UserShared[];
}