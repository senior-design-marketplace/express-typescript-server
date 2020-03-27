import { EventEmitter } from "events";
import uuid from "uuid/v4";
import { HistoryEvent } from "../../lib/types/events/HistoryEvent";
import { HistoryEventModel } from "../enforcer/src/models/HistoryEventModel";
import { EventConsumer } from "./EventConsumer";
import { Viewable } from "../enforcer/src/models/Viewable";

export type HistoryEventConsumer<T extends Viewable> = {
    type: HistoryEvent
} & Pick<EventConsumer<T>,
    | "projectId"
    | "initiateId"
    | "before"
    | "after">

const handlers: Set<HistoryEvent> = new Set([
    "APPLICATION_CREATED",
    "APPLICATION_DELETED",
    "APPLICATION_ACCEPTED",
    "APPLICATION_REJECTED",
    "INVITE_CREATED",
    "INVITE_DELETED",
    "INVITE_ACCEPTED",
    "INVITE_REJECTED",
    "ENTRY_CREATED",
    "ENTRY_UPDATED",
    "ENTRY_DELETED",
    "COVER_UPDATED",
    "AVATAR_UPDATED",
    "PROJECT_CREATED",
    "PROJECT_UPDATED"
])

/**
 * Log is the same for each, so we do not need to break out into
 * each model instance
 */
async function createEvent<T extends Viewable>(params: HistoryEventConsumer<T>) {
    await HistoryEventModel.query()
        .insert({
            id: uuid(),
            ...params
        });
}

export function registerHistoryEventHandlers<T extends Viewable>(emitter: EventEmitter) {
    for (const handler of handlers) {
        emitter.on(handler, async (params: HistoryEventConsumer<T>) => {
            await createEvent(params);
        })
    }
}