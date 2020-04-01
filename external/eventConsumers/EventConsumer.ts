import { Event } from "../../lib/types/events/Base";
import { ViewableModel } from "../enforcer/src/models/ViewableModel";

/**
 * Baseline event format for other events to pick into
 */
export type EventConsumer<T extends ViewableModel> = {
    type: Event,
    projectId: string,
    initiateId: string,
    before?: T,
    after?: T
}