export interface Comment {
    /**
     * The content of the comment
     * @minLength 1
     * @maxLength 256
     */
    body: string;
}