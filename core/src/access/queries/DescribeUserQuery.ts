import { UserMaster } from "../../schemas/types/User/UserMaster";
import UserModel from "../models/UserModel";

namespace DescribeUserQueryParams {

    export type Params = {
        userId: string;
    }

    export type Result = UserMaster;
}

export class DescribeUserQuery {

    public async execute(params: DescribeUserQueryParams.Params): Promise<DescribeUserQueryParams.Result> {
        return UserModel.query()
            .findById(params.userId)
            .throwIfNotFound()
            .then((instance) => instance.$toJson() as UserMaster);
    }
}