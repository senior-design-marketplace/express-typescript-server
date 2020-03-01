import { UserMaster } from "../../schemas/types/User/UserMaster";
import { UserMutable } from "../../schemas/types/User/UserMutable";
import UserModel from "../models/UserModel";

namespace UpdateUserQuery {

    export type Params = {
        userId: string;
        payload: UserMutable;
    }

    export type Result = UserMaster;
}

export class UpdateUserQuery {

    public async execute(params: UpdateUserQuery.Params): Promise<UpdateUserQuery.Result> {
        return UserModel.query()
            .patchAndFetchById(params.userId, params.payload)
            .throwIfNotFound()
            .then((instance) => instance.$toJson() as UserMaster);
    }
}