import { ProjectMaster } from "../../schemas/types/Project/ProjectMaster"
import { UserMaster } from "../../schemas/types/User/UserMaster"
import ProjectModel from "../models/ProjectModel"

namespace GetProjectMembersQuery {

    export type Params = {
        projectId: string;
    }

    export type Result = {
        administrators: UserMaster[];
        contributors: UserMaster[];
    }
}

export class GetProjectMembersQuery {

    public async execute(params: GetProjectMembersQuery.Params): Promise<GetProjectMembersQuery.Result> {
        return ProjectModel.query()
            .findById(params.projectId)
            .throwIfNotFound()
            .then((instance) => {
                return instance.$fetchGraph('[administrators, contributors]')
            })
            .then((instance) => {
                return instance.$toJson() as ProjectMaster;
            })
            .then((instance) => {
                return {
                    administrators: instance.administrators,
                    contributors: instance.contributors
                }
            })
    }
}