import { EventEmitter } from 'events';
import { Actions, EnforcerService, PolicyApplicationFailedError } from '../../../external/enforcer/src/EnforcerService';
import { Resources } from '../../../external/enforcer/src/resources/resources';
import { AddContributorQuery } from '../access/queries/AddContributorQuery';
import { CreateProjectApplicationQuery } from '../access/queries/CreateProjectApplicationQuery';
import { DescribeProjectMembershipQuery } from '../access/queries/DescribeProjectMembershipQuery';
import { DescribeProjectQuery } from '../access/queries/DescribeProjectQuery';
import { GetProjectApplicationQuery } from '../access/queries/GetProjectApplicationQuery';
import { ReplyProjectApplicationQuery } from '../access/queries/ReplyProjectApplicationQuery';
import { AuthorizationError } from '../error/error';
import { ApplicationImmutable } from '../schemas/types/Application/ApplicationImmutable';
import { ApplicationMaster } from '../schemas/types/Application/ApplicationMaster';
import { Response } from '../schemas/types/Response/Response';
import { TranslateErrors } from './decorators';
import * as Utils from './util';

type CreateApplicationParams = Utils.AuthenticatedSingleResourceServiceCall<ApplicationImmutable>;
type ReplyProjectApplicationParams = Utils.AuthenticatedNestedResourceServiceCall<Response>;

export default class ApplicationService {

    constructor(
        private readonly emitter: EventEmitter,
        private readonly enforcer: EnforcerService<Resources, Actions>,
        private readonly describeProjectMembershipQuery: DescribeProjectMembershipQuery,
        private readonly describeProjectQuery: DescribeProjectQuery,
        private readonly createProjectApplicationQuery: CreateProjectApplicationQuery,
        private readonly replyProjectApplicationQuery: ReplyProjectApplicationQuery,
        private readonly addContributorQuery: AddContributorQuery,
        private readonly getProjectApplicationQuery: GetProjectApplicationQuery) {}

    @TranslateErrors([ PolicyApplicationFailedError ], AuthorizationError)
    public async createProjectApplication(params: CreateApplicationParams): Promise<ApplicationMaster> {
        await this.enforcer.enforce(
            params.claims,
            'create',
            'application',
            params.resourceId
        )

        const result = await this.createProjectApplicationQuery.execute({
            projectId: params.resourceId,
            userId: params.claims.username,
            payload: params.payload
        })

        this.emitter.emit('application:new', result);

        return result;
    }

    @TranslateErrors([ PolicyApplicationFailedError ], AuthorizationError)
    public async replyProjectApplication(params: ReplyProjectApplicationParams): Promise<ApplicationMaster> {
        await this.enforcer.enforce(
            params.claims,
            'update',
            'application',
            params.outerResourceId,
            params.innerResourceId
        )

        const result = await this.replyProjectApplicationQuery.execute({
            resourceId: params.innerResourceId,
            response: params.payload.response
        })

        switch (result.status) {
            case "ACCEPTED":
                // we assume that other entries into the project
                // (e.g. an invite) will remove open applications
                await this.addContributorQuery.execute({
                    projectId: params.outerResourceId,
                    userId: result.userId
                })

                this.emitter.emit('application:accepted', result);
                break;

            case "REJECTED":
                this.emitter.emit('application:rejected', result);
                break;
        }

        return result;
    }
}
