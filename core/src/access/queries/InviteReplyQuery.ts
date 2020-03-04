import { InviteMaster } from "../../schemas/types/Invite/InviteMaster";
import { ResponseType } from "../../schemas/types/Response/ResponseType";
import InviteModel from "../models/InviteModel";

namespace InviteReplyQuery {

    export type Params = {
        resourceId: string;
        response: ResponseType
    }

    export type Result = InviteMaster;
}

export class InviteReplyQuery {

    public async execute(params: InviteReplyQuery.Params): Promise<InviteReplyQuery.Result> {
        return InviteModel.query()
            .patchAndFetchById(params.resourceId, {
                status: params.response
            })
            .throwIfNotFound()
            .then((instance) => instance.$toJson() as InviteMaster);
    }
}