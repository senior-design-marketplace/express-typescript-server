import { ApplicationImmutable } from './ApplicationImmutable';
import { StatusType } from '../Status/StatusType';

export interface ApplicationMaster extends ApplicationImmutable {
    /**
     * The id of the entry
     * @format uuid
     */
    id: string;

    /**
     * A note attached to the application
     * @minLength 1
     * @maxLength 256
     */
    note: string;

    /**
     * The project which this application was directed to
     * @format uuid
     */
    projectId: string;
    
    /**
     * The user that submitted the application
     * @minLength 1
     * @maxLength 64
     */
    userId: string;

    createdAt: Date;

    updatedAt: Date;

    status: StatusType;
}