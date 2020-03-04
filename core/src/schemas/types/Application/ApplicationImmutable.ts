export interface ApplicationImmutable {
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
    note?: string;
}