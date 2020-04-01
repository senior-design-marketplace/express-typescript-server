import { EventEmitter } from "events";
import uuid from "uuid/v4";
import { NotificationModel } from "../../external/enforcer/src/models/NotificationModel";
import { getProjectAdministrators } from "../../external/enforcer/src/queries/util";
import { ApplicationNotification } from "../../lib/types/base/ApplicationNotification";
import { InviteNotification } from "../../lib/types/base/InviteNotification";
import { Event } from "../../lib/types/events/Base";
import { ApplicationModel } from "../enforcer/src/models/ApplicationModel";
import { InviteModel } from "../enforcer/src/models/InviteModel";
import { ViewableModel } from "../enforcer/src/models/ViewableModel";
import { EventConsumer } from "./EventConsumer";

export type NotificationEventConsumer<T extends ViewableModel> = Required<Pick<EventConsumer<T>,
    | "type"
    | "initiateId"
    | "after">>

async function getAdministratorIds(projectId: string) {
    return (await getProjectAdministrators(projectId))
        .map(user => user.id);
}

async function createApplicationNotifications(params: NotificationEventConsumer<ApplicationModel>) {
    const recipients: Set<string> = new Set([ 
        ...await getAdministratorIds(params.after.projectId), 
        params.after.userId
    ]);
    
    await createNotifications(recipients, {
        type: "APPLICATION",
        application: await params.after.getVerboseView()
    });
}

async function createInviteNotifications(params: NotificationEventConsumer<InviteModel>) {
    const recipients: Set<string> = new Set([
        ...await getAdministratorIds(params.after.projectId),
        params.after.targetId
    ]);

    await createNotifications(recipients, {
        type: "INVITE",
        invite: await params.after.getVerboseView()
    });
}

async function createNotifications(recipients: Set<string>, document: ApplicationNotification | InviteNotification): Promise<void> {
    const notifications = Array.from(recipients).map(recipient => {
        return {
            id: uuid(),
            userId: recipient,
            document: document
        }
    })

    await NotificationModel.query()
        .insert(notifications);
}

const handlers: Partial<Record<Event, Function>> = {
    "APPLICATION_CREATED": createApplicationNotifications,
    "APPLICATION_ACCEPTED": createApplicationNotifications,
    "APPLICATION_REJECTED": createApplicationNotifications,
    "INVITE_CREATED": createInviteNotifications,
    "INVITE_ACCEPTED": createInviteNotifications,
    "INVITE_REJECTED": createInviteNotifications
}

export function registerNotificationEventHandlers(emitter: EventEmitter) {
    for (const handler of Object.keys(handlers)) {
        emitter.on(handler, handlers[handler]);
    }
}