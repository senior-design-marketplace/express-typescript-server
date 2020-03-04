import { RequestImmutable } from './RequestImmutable';
import { ProjectMembership } from '../Project/ProjectMembership';

export interface RequestMaster extends RequestImmutable {
    /**
     * The identifier of the request
     * @format uuid
     */
    id: string;

    /**
     * The id of the user that sent the request
     * @minLength 1
     * @maxLength 64
     */
    userId: string;

    /**
     * The id of the project that the recipient will join
     * @minLength 1
     * @maxLength 64
     */
    projectId: string

    /**
     * The id of the recipient of the request
     * @minLength 1
     * @maxLength 64
     */
    recipientId: string;

    /**
     * The role that the recipient will assume
     */
    role: ProjectMembership;

    /**
     * A note attached to the request
     * @minLength 1
     * @maxLength 256
     */
    note: string;
}