import { EventEmitter } from "events";
import uuid from "uuid/v4";
import { NotificationModel } from "./access/models/NotificationModel";
import { GetProjectAdministratorsQuery } from "./access/queries/GetProjectAdministratorsQuery";
import { GetProjectMembersQuery } from "./access/queries/GetProjectMembersQuery";
import { ApplicationMaster } from "./schemas/types/Application/ApplicationMaster";
import { InviteMaster } from "./schemas/types/Invite/InviteMaster";
import { ApplicationNotification } from "./schemas/types/Notification/ApplicationNotification";
import { InviteNotification } from "./schemas/types/Notification/InviteNotification";
import { NotificationImmutable } from "./schemas/types/Notification/NotificationImmutable";
import { UserMaster } from "./schemas/types/User/UserMaster";

export class EventHandler {

    constructor(
        private readonly emitter: EventEmitter,
        private readonly getProjectAdministratorsQuery: GetProjectAdministratorsQuery,
        private readonly getProjectMembersQuery: GetProjectMembersQuery) { this.register(); }

    private extractIds(users: UserMaster[]) {
        return users.map(user => user.id);
    }

    private async getAdministratorIds(project: string) {
        const administrators = await this.getProjectAdministratorsQuery.execute({
            projectId: project
        });

        return this.extractIds(administrators);
    }

    private async getMemberIds(project: string) {
        const members = await this.getProjectMembersQuery.execute({
            projectId: project
        });

        return [
            ...this.extractIds(members.administrators),
            ...this.extractIds(members.contributors)
        ]
    }

    private createNotification(recipient: string, document: ApplicationNotification | InviteNotification): NotificationImmutable {
        return {
            id: uuid(),
            userId: recipient,
            document: document
        }
    }

    private handlers = {
        'application:new': async (params: ApplicationMaster) => {
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

        'application:accepted': async (params: ApplicationMaster) => {
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

        'application:rejected': async (params: ApplicationMaster) => {
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

        'invite:new': async (params: InviteMaster) => {
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

        'invite:accepted': async (params: InviteMaster) => {
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

        'invite:rejected': async (params: InviteMaster) => {
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