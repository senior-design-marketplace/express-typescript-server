import { ApplicationShared } from "../../../../lib/types/shared/ApplicationShared";

export namespace Application {

    export type PartialView = never;

    export type VerboseView = ApplicationShared;

    export type FullView = ApplicationShared;
}