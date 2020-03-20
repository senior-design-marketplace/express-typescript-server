import { UserShared } from "../../../../lib/types/shared/UserShared";

export namespace User {

    export type PartialView = 
    Pick<UserShared,
        | 'id'
        | 'firstName'
        | 'lastName'
        | 'email'
        | 'bio'
        | 'thumbnailLink'
        | 'joinedAt'>

    export type VerboseView = PartialView;

    export type FullView = UserShared;
}