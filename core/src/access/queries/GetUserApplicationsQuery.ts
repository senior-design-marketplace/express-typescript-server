import { ApplicationMaster } from "../../schemas/types/Application/ApplicationMaster"
import ApplicationModel from "../models/ApplicationModel";

namespace GetUserApplicationsQuery {

    export type Params = {
        userId: string;
    }

    export type Result = ApplicationMaster[];
}

export class GetUserApplicationsQuery {

    public async execute(params: GetUserApplicationsQuery.Params): Promise<GetUserApplicationsQuery.Result> {
        return ApplicationModel.query()
            .where('userId', params.userId)
            .then((instances) => {
                return instances.map(instance => instance.$toJson() as ApplicationMaster);
            })
    }
}