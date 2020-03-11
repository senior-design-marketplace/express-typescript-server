import { EventEmitter } from "events";
import { DescribeUserQuery } from "../access/queries/DescribeUserQuery";
import { UpdateUserQuery } from "../access/queries/UpdateUserQuery";
import { UserMaster } from "../schemas/types/User/UserMaster";
import { UserMutable } from "../schemas/types/User/UserMutable";
import { UpdateNotificationAsReadQuery } from "../access/queries/UpdateNotificationAsReadQuery";
import { NotificationMaster } from "../schemas/types/Notification/NotificationMaster";
import { NotificationMutable } from "../schemas/types/Notification/NotificationMutable";
import * as Utils from './util';

type DescribeUserParams = Utils.UnauthenticatedSingleResourceServiceCall<null>;
type UpdateUserParams = Utils.AuthenticatedSingleResourceServiceCall<UserMutable>;
type UpdateNotificationAsReadParams = Utils.AuthenticatedNestedResourceServiceCall<NotificationMutable>;

export default class UserService {

    constructor(
        private readonly emitter: EventEmitter,
        private readonly describeUserQuery: DescribeUserQuery,
        private readonly updateUserQuery: UpdateUserQuery,
        private readonly updateNotificationAsReadQuery: UpdateNotificationAsReadQuery) {}

    public async describeUser(params: DescribeUserParams): Promise<UserMaster> {
        return await this.describeUserQuery.execute({
            userId: params.resourceId
        })
    }

    public async updateUser(params: UpdateUserParams): Promise<UserMaster> {
        return this.updateUserQuery.execute({
            userId: params.resourceId,
            payload: params.payload
        })
    }

    public async updateNotificationAsRead(params: UpdateNotificationAsReadParams): Promise<NotificationMaster> {
        return this.updateNotificationAsReadQuery.execute({
            resourceId: params.innerResourceId,
            payload: params.payload
        })
    }
}