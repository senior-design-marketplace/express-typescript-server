import { EventFactory } from "./EventFactory";
import uuid from 'uuid/v4';
import GatewayRunner from "./local";
import { ProjectShared } from "../../../lib/types/shared/ProjectShared";
import { ApplicationShared } from "../../../lib/types/shared/ApplicationShared";
import { CommentShared } from "../../../lib/types/shared/CommentShared";

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
}
