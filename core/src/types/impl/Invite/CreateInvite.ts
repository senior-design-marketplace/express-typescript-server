import { InviteShared } from "../../../../../lib/types/shared/InviteShared";

export type CreateInvite =
    | Pick<InviteShared,
        | 'id'
        | 'targetId'
        | 'role'>
    & Partial<Pick<InviteShared,
        | 'note'>>