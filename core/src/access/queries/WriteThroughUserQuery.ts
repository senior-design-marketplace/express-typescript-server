import { Claims } from "../auth/verify";
import { getDefaultMediaLink } from "./util";
import UserModel from "../models/UserModel";

namespace WriteThroughUserQuery {

    export type Params = Claims;

    export type Result = void;
}

export class WriteThroughUserQuery {

    public async execute(params: WriteThroughUserQuery.Params): Promise<WriteThroughUserQuery.Result> {
        const instance = {
            id: params.username,
            firstName: params.givenName,
            lastName: params.familyName,
            email: params.email
        };

        try {
            await UserModel.query()
                .findById(params.username)
                .throwIfNotFound()
                .patch(instance);
        } catch (e) {
            await UserModel.query().insert({
                ...instance,
                thumbnailLink: getDefaultMediaLink()
            })
        }
    }
}