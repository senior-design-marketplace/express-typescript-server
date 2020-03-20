import { ApplicationModel } from "../models/ApplicationModel";

export namespace Application {

    export type PartialView = never;

    export type VerboseView = ApplicationModel;

    export type FullView = ApplicationModel;
}