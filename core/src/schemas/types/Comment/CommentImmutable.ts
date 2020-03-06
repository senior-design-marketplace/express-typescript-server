export interface CommentImmutable {
    /**
     * An identifier for this comment
     */
    id: string;

    /**
     * The content of the comment
     * @minLength 1
     * @maxLength 256
     */
    body: string;
}