import AdministratorModel from "../models/AdministratorModel";
import ContributorModel from "../models/ContributorModel";

export namespace DescribeProjectMembershipQuery {

    export type Params = {
        userId: string;
        projectId: string;
    }

    export type Result = {
        isAdministrator: boolean;
        isContributor: boolean;
    }
}

export class DescribeProjectMembershipQuery {

    public async execute(params: DescribeProjectMembershipQuery.Params): Promise<DescribeProjectMembershipQuery.Result> {
        const [ isAdministrator, isContributor ] = await Promise.all([
            AdministratorModel.query()
                .findById([params.projectId, params.userId])
                .resultSize()
                .then((num) => Boolean(num)),
            ContributorModel.query()
                .findById([params.projectId, params.userId])
                .resultSize()
                .then((num) => Boolean(num))
            ]);

        return {
            isAdministrator, 
            isContributor
        }
    }
}