import { EventEmitter } from "events";
import { DescribeUserQuery } from "../access/queries/DescribeUserQuery";
import { UpdateNotificationAsReadQuery } from "../access/queries/UpdateNotificationAsReadQuery";
import { UpdateUserQuery } from "../access/queries/UpdateUserQuery";
import { AuthorizationError } from "../error/error";
import { NotificationMaster } from "../schemas/types/Notification/NotificationMaster";
import { NotificationMutable } from "../schemas/types/Notification/NotificationMutable";
import { UserMaster } from "../schemas/types/User/UserMaster";
import { UserMutable } from "../schemas/types/User/UserMutable";
import { TranslateErrors } from "./decorators";
import { Actions, EnforcerService, PolicyApplicationFailedError } from "./enforcer/EnforcerService";
import { Resources } from "./enforcer/resources/resources";
import * as Utils from './util';

type DescribeUserParams = Utils.UnauthenticatedSingleResourceServiceCall<null>;
type UpdateUserParams = Utils.AuthenticatedSingleResourceServiceCall<UserMutable>;
type UpdateNotificationAsReadParams = Utils.AuthenticatedNestedResourceServiceCall<NotificationMutable>;

export default class UserService {

    constructor(
        private readonly emitter: EventEmitter,
        private readonly enforcer: EnforcerService<Resources, Actions>,
        private readonly describeUserQuery: DescribeUserQuery,
        private readonly updateUserQuery: UpdateUserQuery,
        private readonly updateNotificationAsReadQuery: UpdateNotificationAsReadQuery) {}

    public async describeUser(params: DescribeUserParams): Promise<UserMaster> {
        return await this.describeUserQuery.execute({
            userId: params.resourceId
        })
    }

    @TranslateErrors([ PolicyApplicationFailedError ], AuthorizationError)
    public async updateUser(params: UpdateUserParams): Promise<UserMaster> {
        await this.enforcer.enforce(
            params.claims,
            'update',
            'user',
            params.resourceId
        )

        return this.updateUserQuery.execute({
            userId: params.resourceId,
            payload: params.payload
        })
    }

    @TranslateErrors([ PolicyApplicationFailedError ], AuthorizationError)
    public async updateNotificationAsRead(params: UpdateNotificationAsReadParams): Promise<NotificationMaster> {
        await this.enforcer.enforce(
            params.claims,
            'update',
            'notification',
            params.outerResourceId,
            params.innerResourceId
        )

        return this.updateNotificationAsReadQuery.execute({
            resourceId: params.innerResourceId,
            payload: params.payload
        })
    }
}