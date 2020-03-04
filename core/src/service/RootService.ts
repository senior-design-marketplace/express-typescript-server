import { EventEmitter } from "events";
import { DescribeSupportedMajorsQuery } from "../access/queries/DescribeSupportedMajorsQuery";
import { DescribeSupportedTagsQuery } from "../access/queries/DescribeSupportedTagsQuery";
import { GetUserNotificationsQuery } from "../access/queries/GetUserNotificationsQuery";
import { GetUserProjectsQuery } from "../access/queries/GetUserProjectsQuery";
import { MajorMaster } from "../schemas/types/Major/MajorMaster";
import { NotificationMaster } from "../schemas/types/Notification/NotificationMaster";
import { TagMaster } from "../schemas/types/Tag/TagMaster";
import { UserMaster } from "../schemas/types/User/UserMaster";

type LoadRootResult = {
    majors: MajorMaster[],
    tags: TagMaster[]
}

type LoadRootAuthenticatedResult = LoadRootResult & {
    userDetails: UserMaster,
    notifications: NotificationMaster[]
}

export default class RootService {

    constructor(
        private readonly emitter: EventEmitter,
        private readonly describeSupportedMajorsQuery: DescribeSupportedMajorsQuery,
        private readonly describeSupportedTagsQuery: DescribeSupportedTagsQuery,
        private readonly getUserProjectsQuery: GetUserProjectsQuery,
        private readonly getUserNotificationsQuery: GetUserNotificationsQuery) {}

    /**
     * Eventually find a better way of handling conditional
     * promises in parallel.
     */
    public async loadRoot(): Promise<LoadRootResult> {
        const [ majors, tags ] = await Promise.all([
            this.describeSupportedMajorsQuery.execute(),
            this.describeSupportedTagsQuery.execute()
        ])

        return { majors, tags } as LoadRootResult;
    }

    public async loadRootAuthenticated(userId: string): Promise<LoadRootAuthenticatedResult> {
        const [ majors, tags, userDetails, notifications ] = await Promise.all([
            this.describeSupportedMajorsQuery.execute(),
            this.describeSupportedTagsQuery.execute(),
            this.getUserProjectsQuery.execute({ userId }),
            this.getUserNotificationsQuery.execute({ userId })
        ]);

        return { majors, tags, userDetails, notifications } as LoadRootAuthenticatedResult;
    }
}