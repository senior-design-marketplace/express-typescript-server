import { ApplicationShared } from "../../../../../lib/types/shared/ApplicationShared";

export type UpdateApplication =
    | Partial<Pick<ApplicationShared,
        | 'note'>>