import { Event } from "./Base";
import { UserShared } from "../shared/UserShared";

export interface BaseEvent {
    type: Event,
    subject: UserShared | "SYSTEM",
    object: object
}

export interface SystemInitiatedEvent<T extends Event, R extends object> extends BaseEvent {
    type: T,
    subject: "SYSTEM",
    object: R
}

export interface UserInitiatedEvent<T extends Event, R extends object> extends BaseEvent {
    type: T,
    subject: UserShared,
    object: R
}
