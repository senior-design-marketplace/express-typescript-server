import { ProjectImmutable } from "../../schemas/types/Project/ProjectImmutable";
import { ProjectMaster } from "../../schemas/types/Project/ProjectMaster";
import { Claims } from "../auth/verify";
import AdministratorModel from "../models/AdministratorModel";
import ProjectModel from "../models/ProjectModel";

namespace CreateProjectQuery {

    export type Params = {
        claims: Claims,
        payload: ProjectImmutable
    }

    export type Result = ProjectMaster;
}

export class CreateProjectQuery {

    public async execute(params: CreateProjectQuery.Params): Promise<ProjectMaster> {
        try {
            await ProjectModel.query()
                .insert(params.payload)
                .then((instance) => {
                    return AdministratorModel.query().insert({
                        userId: params.claims.username,
                        isAdvisor: params.claims.roles.includes("faculty"),
                        projectId: params.payload.id
                    })
                })
        } catch (e) {
            // Nothing.  Assume that it was a duplicate primary key issue.
            // Since users generate UUIDs, for the sake of idempotency,
            // we will make it seem like nothing happened.
        } finally {
            return ProjectModel.query()
                .findById(params.payload.id)
                .then((instance) => instance.$toJson() as ProjectMaster);
        }            
    }        
}