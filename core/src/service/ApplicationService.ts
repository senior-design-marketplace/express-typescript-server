import { EventEmitter } from 'events';
import { CreateProjectApplicationQuery } from '../access/queries/CreateProjectApplicationQuery';
import { ReplyProjectApplicationQuery } from '../access/queries/ReplyProjectApplicationQuery';
import { ApplicationImmutable } from '../schemas/types/Application/ApplicationImmutable';
import { ApplicationMaster } from '../schemas/types/Application/ApplicationMaster';
import { Response } from '../schemas/types/Response/Response';
import * as Utils from './util';
import { DescribeProjectMembershipQuery } from '../access/queries/DescribeProjectMembershipQuery';
import { DescribeProjectQuery } from '../access/queries/DescribeProjectQuery';
import { BadRequestError } from '../error/error';
import { AlreadyMemberError } from '../error/impl/AlreadyMemberError';
import { NotAcceptingApplicationsError } from '../error/impl/NotAcceptingApplicationsError';

type CreateApplicationParams = Utils.AuthenticatedSingleResourceServiceCall<ApplicationImmutable>;
type ReplyProjectApplicationParams = Utils.AuthenticatedSingleResourceServiceCall<Response>;

export default class ApplicationService {

    constructor(
        private readonly emitter: EventEmitter,
        private readonly describeProjectMembershipQuery: DescribeProjectMembershipQuery,
        private readonly describeProjectQuery: DescribeProjectQuery,
        private readonly createProjectApplicationQuery: CreateProjectApplicationQuery,
        private readonly replyProjectApplicationQuery: ReplyProjectApplicationQuery) {}

    @Utils.translateErrors([ AlreadyMemberError, NotAcceptingApplicationsError ], BadRequestError)
    public async createProjectApplication(params: CreateApplicationParams): Promise<ApplicationMaster> {
        const { isAdministrator, isContributor } = await this.describeProjectMembershipQuery.execute({
            projectId: params.resourceId,
            userId: params.claims.username
        });

        if (isAdministrator || isContributor) {
            throw new AlreadyMemberError(`User ${params.claims.username} is already a member of project ${params.resourceId}`);
        }

        const { acceptingApplications } = await this.describeProjectQuery.execute({
            projectId: params.resourceId
        })
            
        if (!acceptingApplications) {
            throw new NotAcceptingApplicationsError(`Project ${params.resourceId} is not accepting applications`);
        }

        const result = await this.createProjectApplicationQuery.execute({
            projectId: params.resourceId,
            userId: params.claims.username,
            payload: params.payload
        })

        this.emitter.emit('application:new', result);

        return result;
    }

    public async replyProjectApplication(params: ReplyProjectApplicationParams): Promise<ApplicationMaster> {
        const result = await this.replyProjectApplicationQuery.execute({
            resourceId: params.resourceId,
            response: params.payload.response
        })

        switch (result.status) {
            case "ACCEPTED":
                this.emitter.emit('application:accepted', result);
                break;
            case "REJECTED":
                this.emitter.emit('application:rejected', result);
                break;
        }

        return result;
    }
}
