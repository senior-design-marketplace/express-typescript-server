import { InviteModel } from "../models/InviteModel";

export namespace Invite {

    export type PartialView = never;

    export type VerboseView = InviteModel;

    export type FullView = InviteModel;
}