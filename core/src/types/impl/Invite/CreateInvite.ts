import { InviteShared } from "../../../../../lib/types/shared/InviteShared";

export type CreateInvite =
    | Pick<InviteShared,
        | 'id'
        | 'targetId'
        | 'role'
        | 'isAdvisor'>
    & Partial<Pick<InviteShared,
        | 'note'>>