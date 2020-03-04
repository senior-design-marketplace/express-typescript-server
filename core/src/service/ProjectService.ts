import { EventEmitter } from 'events';
import { CreateProjectQuery } from '../access/queries/CreateProjectQuery';
import { DeleteProjectQuery } from '../access/queries/DeleteProjectQuery';
import { DescribeProjectQuery } from '../access/queries/DescribeProjectQuery';
import { DescribeProjectsQuery } from '../access/queries/DescribeProjectsQuery';
import { UpdateProjectQuery } from '../access/queries/UpdateProjectQuery';
import { ProjectImmutable } from '../schemas/types/Project/ProjectImmutable';
import { ProjectMaster } from '../schemas/types/Project/ProjectMaster';
import { ProjectMutable } from '../schemas/types/Project/ProjectMutable';
import { FilterParams } from '../schemas/types/QueryParams/FilterParams';
import { SortParams } from '../schemas/types/QueryParams/SortParams';
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
        private readonly describeProjectQuery: DescribeProjectQuery,
        private readonly describeProjectsQuery: DescribeProjectsQuery,
        private readonly createProjectQuery: CreateProjectQuery,
        private readonly updateProjectQuery: UpdateProjectQuery,
        private readonly deleteProjectQuery: DeleteProjectQuery) {}

    public async createProject(params: CreateProjectParams): Promise<ProjectMaster> {
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

    public async updateProject(params: UpdateProjectParams): Promise<ProjectMaster> {
        return this.updateProjectQuery.execute({
            payload: params.payload,
            resourceId: params.resourceId
        })
    }

    public async deleteProject(params: DeleteProjectParams): Promise<void> {
        return this.deleteProjectQuery.execute({
            projectId: params.resourceId
        })
    }
}
