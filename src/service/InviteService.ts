import { EventEmitter } from "events";
import { InviteProjectMemberQuery } from "../access/queries/InviteProjectMemberQuery";
import { InviteReplyQuery } from "../access/queries/InviteReplyQuery";
import { InviteImmutable } from "../schemas/types/Invite/InviteImmutable";
import { ResponseType } from "../schemas/types/Response/ResponseType";
import * as Utils from './util';

type InviteProjectMemberParams = Utils.AuthenticatedSingleResourceServiceCall<InviteImmutable>;
type InviteReplyParams = Utils.AuthenticatedNestedResourceServiceCall<ResponseType>;

export default class InviteService {

    constructor(
        private readonly emitter: EventEmitter,
        private readonly inviteProjectMemberQuery: InviteProjectMemberQuery,
        private readonly inviteReplyQuery: InviteReplyQuery) {}

    public async inviteProjectMember(params: InviteProjectMemberParams) {
        const result = await this.inviteProjectMemberQuery.execute({
            payload: params.payload,
            initiateId: params.claims.username
        })

        this.emitter.emit('invite:new', result);

        return result;
    }

    public async inviteReply(params: InviteReplyParams) {
        const result = await this.inviteReplyQuery.execute({
            resourceId: params.innerResourceId,
            response: params.payload
        })

        switch (result.status) {
            case "ACCEPTED":
                this.emitter.emit('invite:accepted', result);
                break;
            case "REJECTED":
                this.emitter.emit('invite:rejected', result);
                break;
        }

        return result;
    }
}