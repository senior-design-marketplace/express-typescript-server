import { ProjectMaster } from "../../schemas/types/Project/ProjectMaster";
import { UserMaster } from "../../schemas/types/User/UserMaster";
import ProjectModel from "../models/ProjectModel";

namespace GetProjectAdministratorsQuery {

    export type Params = {
        projectId: string;
    }

    export type Result = UserMaster[];
}

export class GetProjectAdministratorsQuery {

    public async execute(params: GetProjectAdministratorsQuery.Params): Promise<GetProjectAdministratorsQuery.Result> {
        return ProjectModel.query()
            .findById(params.projectId)
            .throwIfNotFound()
            .then((instance) => {
                return instance.$fetchGraph('[administrators]')
            })
            .then((instance) => {
                return (instance.$toJson() as ProjectMaster).administrators;
            })
    }
}