import { Event } from "../../lib/types/events/Base"
import { Viewable } from "../enforcer/src/models/Viewable";

/**
 * Baseline event format for other events to pick into
 */
export type EventConsumer<T extends Viewable> = {
    type: Event,
    projectId: string,
    initiateId: string,
    before?: T,
    after?: T
}