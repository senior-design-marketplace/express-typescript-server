import { EventFactory } from "./EventFactory";
import uuid from 'uuid/v4';
import GatewayRunner from "./local";
import { ProjectShared } from "../../../lib/types/shared/ProjectShared";
import { ApplicationShared } from "../../../lib/types/shared/ApplicationShared";
import { CommentShared } from "../../../lib/types/shared/CommentShared";
import { InviteShared } from "../../../lib/types/shared/InviteShared";
import { TextBoardEntry } from "../../../lib/types/base/TextBoardEntry";
import { MediaBoardEntry } from "../../../lib/types/base/MediaBoardEntry";
import { getDefaultMediaLink } from "../../../external/enforcer/src/queries/util";
import { Membership } from "../../../lib/types/base/Membership";

type GenericResponse = {
    resourceId: string;
    payload: any
}

export class GenericRequestFactory {

    constructor(private runner: GatewayRunner, private eventFactory: EventFactory) {}

    public async createGenericProject(creator: string, options?: Partial<ProjectShared>): Promise<GenericResponse> {
        const id = uuid();

        const response = await this.runner.runEvent(
            this.eventFactory.createEvent('POST', `/projects`)
                .withBody({
                    id,
                    title: 'Generic Project',
                    tagline: 'So tests do not end up at 2000 lines',
                    ...options
                })
                .withUser(creator)
                .build()
        );

        return {
            resourceId: id,
            payload: response
        };
    }

    public async createGenericApplication(creator: string, project: string, options?: Partial<ApplicationShared>): Promise<GenericResponse> {
        const id = uuid();

        const response = await this.runner.runEvent(
            this.eventFactory.createEvent('POST', `/projects/${project}/applications`)
                .withBody({
                    id,
                    ...options
                })
                .withUser(creator)
                .build()
        );

        return {
            resourceId: id,
            payload: response
        };
    }

    public async createGenericComment(creator: string, project: string, parent?: string, options?: Partial<CommentShared>): Promise<GenericResponse> {
        const id = uuid();

        const path = parent ? `/projects/${project}/comments/${parent}` : `/projects/${project}/comments`;

        const response = await this.runner.runEvent(
            this.eventFactory.createEvent('POST', path)
                .withBody({
                    id,
                    body: "A very generic comment",
                    ...options
                })
                .withUser(creator)
                .build()
        );

        return {
            resourceId: id,
            payload: response
        };
    }

    public async createGenericInvite(creator: string, target: string, project: string, membership: Membership, options?: Partial<InviteShared>): Promise<GenericResponse> {
        const id = uuid();

        const response = await this.runner.runEvent(
            this.eventFactory.createEvent('POST', `/projects/${project}/invites`)
                .withBody({
                    id,
                    targetId: target,
                    ...membership
                })
                .withUser(creator)
                .build()
        );

        return {
            resourceId: id,
            payload: response
        };
    }

    private getGenericBoardEntryDocument(type: "TEXT" | "MEDIA"): TextBoardEntry | MediaBoardEntry {
        switch (type) {
            case "TEXT":
                return {
                    type: "TEXT",
                    body: "Wow, so generic"
                }
            case "MEDIA":
                return {
                    type: "MEDIA",
                    mediaLink: getDefaultMediaLink()
                }
        }
    }

    public async createGenericBoardEntry(creator: string, project: string, type: "TEXT" | "MEDIA"): Promise<GenericResponse> {
        const id = uuid();

        const document = this.getGenericBoardEntryDocument(type);

        const response = await this.runner.runEvent(
            this.eventFactory.createEvent("POST", `/projects/${project}/board`)
                .withBody({
                    id,
                    document
                })
                .withUser(creator)
                .build()
        );

        return {
            resourceId: id,
            payload: response
        };
    }

    public async acceptApplication(creator: string, project: string, application: string): Promise<GenericResponse> {
        const response = await this.runner.runEvent(
            this.eventFactory.createEvent("PATCH", `/projects/${project}/applications/${application}`)
                .withBody({
                    response: "ACCEPTED"
                })
                .withUser(creator)
                .build()
        )

        return {
            resourceId: application,
            payload: response
        }
    }

    public async acceptInvite(creator: string, project: string, invite: string): Promise<GenericResponse> {
        const response = await this.runner.runEvent(
            this.eventFactory.createEvent("POST", `/projects/${project}/invites/${invite}`)
                .withBody({
                    response: "ACCEPTED"
                })
                .withUser(creator)
                .build()
        )

        return {
            resourceId: invite,
            payload: response
        }
    }
}
