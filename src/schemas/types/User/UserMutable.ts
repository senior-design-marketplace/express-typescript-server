export interface UserMutable {
    /**
     * A short description of the user.
     * @minLength 1
     * @maxLength 256
     */
    bio?: string;
}