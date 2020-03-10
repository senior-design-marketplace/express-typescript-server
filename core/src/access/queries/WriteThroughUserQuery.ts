import { Claims } from "../auth/verify";
import { getDefaultMediaLink } from "./util";
import UserModel from "../models/UserModel";

namespace WriteThroughUserQuery {

    export type Params = Claims;

    export type Result = void;
}

export class WriteThroughUserQuery {

    public async execute(params: WriteThroughUserQuery.Params): Promise<WriteThroughUserQuery.Result> {
        try {
            await UserModel.query()
                .findById(params.username)
                .throwIfNotFound()
                .patch({
                    id: params.username
                });
        } catch (e) {
            await UserModel.query().insert({
                id: params.username,
                thumbnailLink: getDefaultMediaLink()
            })
        }
    }
}