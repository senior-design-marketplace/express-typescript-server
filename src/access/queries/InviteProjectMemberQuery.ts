import { InviteImmutable } from "../../schemas/types/Invite/InviteImmutable";
import { InviteMaster } from "../../schemas/types/Invite/InviteMaster";
import InviteModel from "../models/InviteModel";

namespace InviteProjectMemberQuery {

    export type Params = {
        initiateId: string;
        payload: InviteImmutable;
    }

    export type Result = InviteMaster;
}

export class InviteProjectMemberQuery {

    public async execute(params: InviteProjectMemberQuery.Params): Promise<InviteProjectMemberQuery.Result> {
        try {
            await InviteModel.query()
                .insert({
                    initiateId: params.initiateId,
                    status: "PENDING",
                    ...params.payload
                })
        } catch (e) {
            // idempotency for duplicate primary key
        } finally {
            return InviteModel.query()
                .findById(params.payload.id)
                .throwIfNotFound()
                .then((instance) => instance.$toJson() as InviteMaster);
        }
    }
}