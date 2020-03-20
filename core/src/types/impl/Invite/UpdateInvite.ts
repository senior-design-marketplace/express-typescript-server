import { InviteShared } from "../../../../../lib/types/shared/InviteShared";

export type UpdateInvite =
    | Partial<Pick<InviteShared,
        'note'>>