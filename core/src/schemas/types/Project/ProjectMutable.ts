import { TagMaster } from "../Tag/TagMaster";
import { MajorMaster } from "../Major/MajorMaster";

/**
 * Using the basic update architecture, the relations
 * belong to the master record.  If using the batched
 * and parallelized architecture, then they would go
 * here.
 */
export interface ProjectMutable {
    /**
     * The title of the project
     * @minLength 1
     * @maxLength 256
     */
    title?: string;

    /**
     * A short description of the project
     * @minLength 1
     * @maxLength 256
     */
    tagline?: string;

    /**
     * A longer description of the project
     * @minLength 1
     * @maxLength 2048
     */
    body?: string;

    /**
     * A flag set by the advisor to prevent or enable further applications
     */
    acceptingApplications?: boolean;
}