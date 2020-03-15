import { EventEmitter } from "events";
import { Actions, EnforcerService, PolicyApplicationFailedError } from "../../../external/enforcer/src/EnforcerService";
import { Resources } from "../../../external/enforcer/src/resources/resources";
import { InviteProjectMemberQuery } from "../access/queries/InviteProjectMemberQuery";
import { InviteReplyQuery } from "../access/queries/InviteReplyQuery";
import { AuthorizationError } from "../error/error";
import { InviteImmutable } from "../schemas/types/Invite/InviteImmutable";
import { ResponseType } from "../schemas/types/Response/ResponseType";
import { TranslateErrors } from "./decorators";
import * as Utils from './util';

type InviteProjectMemberParams = Utils.AuthenticatedSingleResourceServiceCall<InviteImmutable>;
type InviteReplyParams = Utils.AuthenticatedNestedResourceServiceCall<ResponseType>;

export default class InviteService {

    constructor(
        private readonly emitter: EventEmitter,
        private readonly enforcer: EnforcerService<Resources, Actions>,
        private readonly inviteProjectMemberQuery: InviteProjectMemberQuery,
        private readonly inviteReplyQuery: InviteReplyQuery) {}

    @TranslateErrors([ PolicyApplicationFailedError ], AuthorizationError)
    public async inviteProjectMember(params: InviteProjectMemberParams) {
        await this.enforcer.enforce(
            params.claims,
            'create',
            'invite',
            params.resourceId
        )

        const result = await this.inviteProjectMemberQuery.execute({
            payload: params.payload,
            initiateId: params.claims.username
        })

        this.emitter.emit('invite:new', result);

        return result;
    }

    @TranslateErrors([ PolicyApplicationFailedError ], AuthorizationError)
    public async inviteReply(params: InviteReplyParams) {
        await this.enforcer.enforce(
            params.claims,
            'update',
            'invite',
            params.outerResourceId,
            params.innerResourceId
        )

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