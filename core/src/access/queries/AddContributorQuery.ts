import ContributorModel from "../models/ContributorModel";

namespace AddContributorQuery {

    export type Params = {
        projectId: string;
        userId: string;
    }

    export type Result = Promise<void>
}

export class AddContributorQuery {

    public async execute(params: AddContributorQuery.Params) {
        await ContributorModel.query()
            .insert({
                projectId: params.projectId,
                userId: params.userId
            })
    }
}