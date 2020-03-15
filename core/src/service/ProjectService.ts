import { EventEmitter } from 'events';
import { CreateProjectQuery } from '../access/queries/CreateProjectQuery';
import { DeleteProjectQuery } from '../access/queries/DeleteProjectQuery';
import { DescribeProjectQuery } from '../access/queries/DescribeProjectQuery';
import { DescribeProjectsQuery } from '../access/queries/DescribeProjectsQuery';
import { UpdateProjectQuery } from '../access/queries/UpdateProjectQuery';
import { AuthorizationError } from '../error/error';
import { ProjectImmutable } from '../schemas/types/Project/ProjectImmutable';
import { ProjectMaster } from '../schemas/types/Project/ProjectMaster';
import { ProjectMutable } from '../schemas/types/Project/ProjectMutable';
import { FilterParams } from '../schemas/types/QueryParams/FilterParams';
import { SortParams } from '../schemas/types/QueryParams/SortParams';
import { TranslateErrors } from './decorators';
import { Actions, EnforcerService, PolicyApplicationFailedError } from './enforcer/EnforcerService';
import { Resources } from './enforcer/resources/resources';
import * as Utils from './util';

interface DescribeProjectsParams {
    sortParams: SortParams;
    filterParams: FilterParams;
}

type CreateProjectParams = Utils.AuthenticatedServiceCall<ProjectImmutable>;
type UpdateProjectParams = Utils.AuthenticatedSingleResourceServiceCall<ProjectMutable>;
type DescribeProjectParams = Utils.UnauthenticatedSingleResourceServiceCall<null>;
type DeleteProjectParams = Utils.AuthenticatedSingleResourceServiceCall<null>;

export default class ProjectService {

    constructor(
        private readonly emitter: EventEmitter,
        private readonly enforcer: EnforcerService<Resources, Actions>,
        private readonly describeProjectQuery: DescribeProjectQuery,
        private readonly describeProjectsQuery: DescribeProjectsQuery,
        private readonly createProjectQuery: CreateProjectQuery,
        private readonly updateProjectQuery: UpdateProjectQuery,
        private readonly deleteProjectQuery: DeleteProjectQuery) {}

    @TranslateErrors([ PolicyApplicationFailedError ], AuthorizationError)
    public async createProject(params: CreateProjectParams): Promise<ProjectMaster> {
        await this.enforcer.enforce(
            params.claims,
            'create',
            'project'
        );

        return this.createProjectQuery.execute({
            claims: params.claims,
            payload: params.payload
        });
    }

    public async describeProject(params: DescribeProjectParams): Promise<ProjectMaster> {
        return this.describeProjectQuery.execute({
            projectId: params.resourceId
        });
    }

    public async describeProjects(params: DescribeProjectsParams): Promise<ProjectMaster[]> {
        return this.describeProjectsQuery.execute({
            filterParams: params.filterParams,
            sortParams: params.sortParams
        });
    }

    @TranslateErrors([ PolicyApplicationFailedError ], AuthorizationError)
    public async updateProject(params: UpdateProjectParams): Promise<ProjectMaster> {
        await this.enforcer.enforce(
            params.claims,
            'update',
            'project',
            params.resourceId
        );

        return this.updateProjectQuery.execute({
            payload: params.payload,
            resourceId: params.resourceId
        });
    }

    @TranslateErrors([ PolicyApplicationFailedError ], AuthorizationError)
    public async deleteProject(params: DeleteProjectParams): Promise<void> {
        await this.enforcer.enforce(
            params.claims,
            'delete',
            'project',
            params.resourceId
        );

        return this.deleteProjectQuery.execute({
            projectId: params.resourceId
        });
    }
}
