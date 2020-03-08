import { ApplicationMaster } from "../../schemas/types/Application/ApplicationMaster";
import ApplicationModel from "../models/ApplicationModel";

namespace GetProjectApplicationQuery {

    export type Params = {
        projectId: string;
        applicationId: string;
    }

    export type Result = ApplicationMaster;
}

export class GetProjectApplicationQuery {

    public async execute(params: GetProjectApplicationQuery.Params): Promise<GetProjectApplicationQuery.Result> {
        return ApplicationModel.query()
            .findById(params.applicationId)
            .throwIfNotFound()
            .then((instance) => instance.$toJson() as ApplicationMaster);
    }
}