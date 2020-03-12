import { UserImmutable } from './UserImmutable';

export interface UserMaster extends UserImmutable {
    /**
     * A link to a small photo of the user
     * @minLength 1
     * @maxLength 256
     */
    thumbnailLink: string;

    /**
     * The identity of the user
     * @minLength 1
     * @maxLength 256
     */
    id: string;

    /**
     * The first name of the user
     */
    firstName: string;

    /**
     * The last name of the user
     */
    lastName: string;

    /**
     * The email address of the user
     */
    email: string;

    /**
     * When the user joined the system
     */
    joinedAt: Date;
}