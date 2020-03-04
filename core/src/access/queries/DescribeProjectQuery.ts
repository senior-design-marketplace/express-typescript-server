import { ProjectMaster } from "../../schemas/types/Project/ProjectMaster";
import ProjectModel from "../models/ProjectModel";

namespace DescribeProjectQuery {

    export type Params = {
        projectId: string;
    }

    export type Result = ProjectMaster;
}

export class DescribeProjectQuery {

    public async execute(params: DescribeProjectQuery.Params): Promise<DescribeProjectQuery.Result> {
        return ProjectModel.query()
            .findById(params.projectId)
            .throwIfNotFound()
            .then((instance) => {
                return instance.$fetchGraph('[starredBy, tags, requestedMajors, administrators, contributors, applications, boardItems]')
            })
            .then((instance) => instance.$toJson() as ProjectMaster);
    }
}