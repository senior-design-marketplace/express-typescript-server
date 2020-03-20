import { EventEmitter } from "events";
import uuid from "uuid/v4";
import { EnforcerService } from "../../external/enforcer/src/EnforcerService";
import { UserShared } from "../../lib/types/shared/UserShared";
import { ApplicationNotification } from "../../lib/types/base/ApplicationNotification";
import { InviteNotification } from "../../lib/types/base/InviteNotification";
import { NotificationShared } from "../../lib/types/shared/NotificationShared";
import { getProjectAdministrators, getProjectMembers } from "../../external/enforcer/src/queries/util";
import { ApplicationShared } from "../../lib/types/shared/ApplicationShared";
import { NotificationModel } from "../../external/enforcer/src/models/NotificationModel";
import { InviteShared } from "../../lib/types/shared/InviteShared";

export class EventHandler {

    constructor(
        private readonly emitter: EventEmitter,
        private enforcerService: EnforcerService) { this.register(); }

    private extractIds(users: UserShared[]) {
        return users.map(user => user.id);
    }

    private async getAdministratorIds(project: string) {
        const administrators = await getProjectAdministrators(project);
        return this.extractIds(administrators);
    }

    private async getMemberIds(project: string) {
        const members = await getProjectMembers(project);
        return this.extractIds(members);
    }

    private createNotification(recipient: string, document: ApplicationNotification | InviteNotification): Partial<NotificationShared> {
        return {
            id: uuid(),
            userId: recipient,
            document: document
        }
    }

    private handlers = {
        'application:new': async (params: ApplicationShared) => {
            const recipients = [ 
                ...await this.getAdministratorIds(params.projectId), 
                params.userId 
            ];

            const notifications = recipients.map((recipient) => {
                return this.createNotification(recipient, {
                    type: "APPLICATION",
                    application: params
                })
            })

            await NotificationModel.query()
                .insert(notifications);
        },

        'application:accepted': async (params: ApplicationShared) => {
            const recipients = await this.getMemberIds(params.projectId);

            const notifications = recipients.map((recipient) => {
                return this.createNotification(recipient, {
                    type: "APPLICATION",
                    application: params
                })
            })

            await NotificationModel.query()
                .insert(notifications);
        },

        'application:rejected': async (params: ApplicationShared) => {
            const recipients = [
                ...await this.getAdministratorIds(params.projectId),
                params.userId
            ];

            const notifications = recipients.map((recipient) => {
                return this.createNotification(recipient, {
                    type: "APPLICATION",
                    application: params
                })
            })

            await NotificationModel.query()
                .insert(notifications);
        },

        'invite:new': async (params: InviteShared) => {
            const recipients = [
                ...await this.getAdministratorIds(params.projectId),
                params.initiateId
            ]
            
            const notifications = recipients.map((recipient) => {
                return this.createNotification(recipient, {
                    type: "INVITE",
                    invite: params
                })
            })

            await NotificationModel.query()
                .insert(notifications);
        },

        'invite:accepted': async (params: InviteShared) => {
            const recipients = await this.getMemberIds(params.projectId);

            const notifications = recipients.map((recipient) => {
                return this.createNotification(recipient, {
                    type: "INVITE",
                    invite: params
                })
            })

            await NotificationModel.query()
                .insert(notifications);
        },

        'invite:rejected': async (params: InviteShared) => {
            const recipients = [
                ...await this.getAdministratorIds(params.projectId),
                params.initiateId
            ]

            const notifications = recipients.map((recipient) => {
                return this.createNotification(recipient, {
                    type: "INVITE",
                    invite: params
                })
            })

            await NotificationModel.query()
                .insert(notifications);
        }
    }

    public register() {
        for(const key of Object.keys(this.handlers)) {
            this.emitter.on(key, this.handlers[key]);
        }
    }
}