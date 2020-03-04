import { ProjectMaster } from '../../schemas/types/Project/ProjectMaster';
import { ProjectMutable } from '../../schemas/types/Project/ProjectMutable';
import ProjectModel from '../models/ProjectModel';

namespace UpdateProjectQuery {

    export type Params = {
        resourceId: string;
        payload: ProjectMutable;
    }

    export type Result = ProjectMaster;
}

export class UpdateProjectQuery {

    public async execute(params: UpdateProjectQuery.Params): Promise<UpdateProjectQuery.Result> {
        return ProjectModel.query()
            .patchAndFetchById(params.resourceId, params.payload)
            .throwIfNotFound()
            .then((instance) => instance.$toJson() as ProjectMaster);
    }
}