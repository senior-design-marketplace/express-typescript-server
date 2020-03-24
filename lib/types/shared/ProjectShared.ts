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
}