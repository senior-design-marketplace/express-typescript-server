import { Transaction } from "objection";
import { UserMaster } from "../../schemas/types/User/UserMaster";
import UserModel from "../models/UserModel";

namespace GetUserProjectsQuery {

    export type Params = {
        userId: string;
        transaction?: Transaction;
    }

    export type Result = UserMaster
}

export class GetUserProjectsQuery {

    public async execute(params: GetUserProjectsQuery.Params): Promise<GetUserProjectsQuery.Result> {
        return UserModel.query(params.transaction)
            .findById(params.userId)
            .throwIfNotFound()
            .then((instance) => {
                return instance.$fetchGraph('[contributorOn, administratorOn.applications(onlyPending)]')
                    .modifiers({
                        onlyPending(builder) {
                            builder.where('status', "PENDING")
                        }
                    })
            })
            .then((instance) => {
                return instance.$toJson() as UserMaster;
            })
    }
}