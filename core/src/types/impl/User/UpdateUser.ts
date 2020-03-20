import { UserShared } from "../../../../../lib/types/shared/UserShared";

export type UpdateUser =
    | Partial<Pick<UserShared,
        | 'bio'>>