export type Sort = "new" | "popular";

export interface SortParams {
    /**
     * Sort the query by some parameter
     */
    sortBy?: Sort;

    /**
     * Order the query results in some way
     */
    order?: "reverse"

    /**
     * Pagination token to get next page of results
     * @TJS-type integer
     * @minimum 0
     */
    offset?: number;
}