import { ApplicationShared } from "../../../../../lib/types/shared/ApplicationShared";

export type CreateApplication =
    | Pick<ApplicationShared,
        | 'id'>
    & Partial<Pick<ApplicationShared,
        | 'note'>>