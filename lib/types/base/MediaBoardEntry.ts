export interface MediaBoardEntry {
    
    /**
     * A typing flag to denote the format of the entry
     */
    type: "MEDIA";

    /**
     * A link to download some media
     * @minLength 1
     * @maxLength 256
     */
    mediaLink: string;
}
