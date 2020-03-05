import { ProjectImmutable } from "./ProjectImmutable";
import { TagMaster } from "../Tag/TagMaster";
import { MajorMaster } from "../Major/MajorMaster";
import { BoardEntryMaster } from "../ProjectBoard/BoardEntryMaster";
import { ApplicationMaster } from "../Application/ApplicationMaster";
import { UserMaster } from "../User/UserMaster";

export interface ProjectMaster extends ProjectImmutable {
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

    /**
     * Entries on the project board of a project
     * @minItems 0
     */
    boardItems: BoardEntryMaster[];

    /**
     * Applications to the project
     * @minItems 0
     */
    applications: ApplicationMaster[];

    /**
     * People who are working on the project
     * @minItems 0
     */
    contributors: UserMaster[];

    /**
     * Contributors with elevated privileges
     * @minItems 0
     */
    administrators: UserMaster[];

    /**
     * Tags associated with the project
     * @minItems 0
     */
    tags: TagMaster[];

    /**
     * Majors of students that are needed for the project
     * @minItems 0
     */
    requestedMajors: MajorMaster[];

    /**
     * Users that have starred this project
     * @minItems 0
     */
    starredBy: UserMaster[];
}