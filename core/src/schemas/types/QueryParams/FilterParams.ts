import { Tag } from '../Tag/Tag';
import { Major } from '../Major/Major';

export interface FilterParams {
    /**
     * A tag of a project
     */
    tag?: Tag;

    /**
     * The id of an advisor
     * @minLength 1
     * @maxLength 64
     */
    advisorId?: string;

    /**
     * Whether or not the project has an advisor guiding it
     */
    hasAdvisor?: boolean;

    /**
     * A major of students that the project has requested
     */
    requestedMajor?: Major;

    /**
     * Whether or not the project is accepting applications
     */
    acceptingApplications?: boolean
}