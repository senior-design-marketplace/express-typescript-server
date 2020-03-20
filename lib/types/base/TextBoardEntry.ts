export interface TextBoardEntry {
    
    /**
     * A typing flag to denote the format of the entry
     */
    type: "TEXT";
    
    /**
     * The text of a board entry
     * @minLength 1
     * @maxLength 2048
     */
    body: string;
}