import { S3 } from "aws-sdk";
import { EventEmitter } from "events";
import { Model, Transaction } from "objection";
import { Claims } from "../../../core/src/auth/verify";
import { AuthenticationError, AuthorizationError, InternalError, NotFoundError } from "../../../core/src/error/error";
import { ApplicationShared } from "../../../lib/types/shared/ApplicationShared";
import { BoardEntryShared } from "../../../lib/types/shared/BoardEntryShared";
import { CommentShared } from "../../../lib/types/shared/CommentShared";
import { InviteShared } from "../../../lib/types/shared/InviteShared";
import { MajorShared } from "../../../lib/types/shared/MajorShared";
import { NotificationShared } from "../../../lib/types/shared/NotificationShared";
import { ProjectShared } from "../../../lib/types/shared/ProjectShared";
import { ResponseShared } from "../../../lib/types/shared/ResponseShared";
import { TagShared } from "../../../lib/types/shared/TagShared";
import { UserShared } from "../../../lib/types/shared/UserShared";
import { EventConsumer } from "../../eventConsumers/EventConsumer";
import { Actions, EnforcementResult, Enforcer } from "./Enforcer";
import { MediaRequestFactory } from "./MediaRequestFactory";
import { ApplicationModel } from "./models/ApplicationModel";
import { BoardItemModel } from "./models/BoardItemModel";
import { CommentModel } from "./models/CommentModel";
import { InviteModel } from "./models/InviteModel";
import { MajorModel } from "./models/MajorModel";
import { NotificationModel } from "./models/NotificationModel";
import { ProjectModel } from "./models/ProjectModel";
import { TagModel } from "./models/TagModel";
import { UserModel } from "./models/UserModel";
import { filterProjects } from "./queries/filterProjects";
import { getDefaultMediaLink, describeMembership } from "./queries/util";
import { Resources } from "./resources/resources";
import { Project } from "./types/Project";
import { HistoryEventConsumer } from "../../eventConsumers/HistoryConsumer";
import { NotificationEventConsumer } from "../../eventConsumers/NotificationConsumer";
import { MemberModel } from "./models/MemberModel";
import { Membership } from "../../../lib/types/base/Membership";
import uuid from "uuid/v4";
import { ViewableModel } from "./models/ViewableModel";
import { CreateDocumentMedia } from "../../../core/src/types/impl/Media/CreateDocumentMedia";
import { CreateImageMedia } from "../../../core/src/types/impl/Media/CreateImageMedia";
import { CreateBoardMedia } from "../../../core/src/types/impl/Media/CreateBoardMedia";
import { UpdateTags } from "../../../core/src/types/impl/Project/UpdateTags";
import { UpdateMajors } from "../../../core/src/types/impl/Project/UpdateMajors";
import unique from "lodash/uniq";

export type Options = {
    asAdmin?: boolean,
    noRelations?: boolean,
    transaction?: Transaction
}

export type MaybeAuthenticatedServiceCall<T extends object> = {
    claims?: Claims,
    payload: T,
    resourceIds: string[]
}

export type AuthenticatedServiceCall<T extends object> = Required<MaybeAuthenticatedServiceCall<T>>;

export class EnforcerService {

    constructor(
        private enforcer: Enforcer<Resources, Actions, object>,
        private emitter: EventEmitter,
        private mediaRequestFactory: MediaRequestFactory) {}

    public async listMajors(call: MaybeAuthenticatedServiceCall<object>, options?: Options): Promise<MajorShared[]> {
        const result: EnforcementResult = { view: 'full' }; // unauthenticated methods by default return full view

        const majors = await MajorModel.query(options?.transaction);
        return this.handleView(result, majors, options);
    }

    public async updateMajors(call: AuthenticatedServiceCall<UpdateMajors>, options?: Options): Promise<MajorShared[]> {
        const result = await this.enforce('update', 'project.majors', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];

        const project = await ProjectModel.query(options?.transaction)
            .findById(projectId)
            .throwIfNotFound();

        await project.$relatedQuery('requestedMajors', options?.transaction)
            .unrelate();

        await project.$relatedQuery('requestedMajors', options?.transaction)
            .relate(unique(call.payload));

        const majors = await project.$relatedQuery('requestedMajors', options?.transaction);
        return this.handleView(result, majors, options);
    }

    public async listTags(call: MaybeAuthenticatedServiceCall<object>, options?: Options): Promise<TagShared[]> {
        const result: EnforcementResult = { view: 'full' };

        const tags = await TagModel.query(options?.transaction);
        return this.handleView(result, tags, options);
    }

    public async updateTags(call: AuthenticatedServiceCall<UpdateTags>, options?: Options): Promise<TagShared[]> {
        const result = await this.enforce('update', 'project.tags', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];

        const project = await ProjectModel.query(options?.transaction)
            .findById(projectId)
            .throwIfNotFound();

        await project.$relatedQuery('tags', options?.transaction)
            .unrelate();

        await project.$relatedQuery('tags', options?.transaction)
            .relate(unique(call.payload));

        const tags = await project.$relatedQuery('tags', options?.transaction);
        return this.handleView(result, tags, options);
    }    

    public async createComment(call: AuthenticatedServiceCall<Partial<CommentShared>>, options?: Options): Promise<Partial<CommentShared>> {
        const result = await this.enforce('create', 'project.comment', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];

        const comment = await CommentModel.query(options?.transaction)
            .insertAndFetch({
                projectId: projectId,
                userId: call.claims.username,
                ...call.payload
            });

        return this.handleView(result, comment, options);
    }

    public async updateComment(call: AuthenticatedServiceCall<Partial<CommentShared>>, options?: Options): Promise<Partial<CommentShared>> {
        const result = await this.enforce('update', 'project.comment', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const commentId = call.resourceIds[1];

        const comment = await CommentModel.query(options?.transaction)
            .patchAndFetchById(commentId, call.payload)
            .throwIfNotFound();

        return this.handleView(result, comment, options);
    }

    public async replyComment(call: AuthenticatedServiceCall<Partial<CommentShared>>, options?: Options): Promise<Partial<CommentShared>> {
        const result = await this.enforce('reply', 'project.comment', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const commentId = call.resourceIds[1];

        const comment = await CommentModel.query(options?.transaction)
            .insertAndFetch({
                projectId: projectId,
                userId: call.claims.username,
                parentId: commentId,
                ...call.payload
            });

        return this.handleView(result, comment, options);
    }

    public async deleteComment(call: AuthenticatedServiceCall<object>, options?: Options): Promise<void> {
        const result = await this.enforce('delete', 'project.comment', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const commentId = call.resourceIds[1];

        await CommentModel.query(options?.transaction)
            .deleteById(commentId)
            .throwIfNotFound();
    }

    public async createNotification(call: MaybeAuthenticatedServiceCall<Partial<NotificationShared>>, options?: Options): Promise<Partial<NotificationShared>> {
        const result = await this.enforce('create', 'user.notification', call, options, ...call.resourceIds);

        const notification = await NotificationModel.query(options?.transaction)
            .insertAndFetch({
                read: false,
                ...call.payload
            });

        return this.handleView(result, notification, options);
    }

    public async updateNotification(call: AuthenticatedServiceCall<Partial<NotificationShared>>, options?: Options): Promise<Partial<NotificationShared>> {
        const result = await this.enforce('update', 'user.notification', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const notificationId = call.resourceIds[1];

        const notification = await NotificationModel.query(options?.transaction)
            .patchAndFetchById(notificationId, { read: call.payload.read })
            .throwIfNotFound();

        return this.handleView(result, notification, options);
    }

    public async deleteNotification(call: AuthenticatedServiceCall<object>, options?: Options): Promise<void> {
        const result = await this.enforce('delete', 'user.notification', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const notificationId = call.resourceIds[1];

        await NotificationModel.query(options?.transaction)
            .deleteById(notificationId)
            .throwIfNotFound();
    }

    public async createApplication(call: AuthenticatedServiceCall<Partial<ApplicationShared>>, options?: Options): Promise<Partial<ApplicationShared>> {
        const result = await this.enforce('create', 'project.application', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];

        const application = await ApplicationModel.query(options?.transaction)
            .insertAndFetch({
                projectId: projectId,
                userId: call.claims.username,
                status: 'PENDING',
                ...call.payload
            });

        this.emitEvents([{ 
            type: "APPLICATION_CREATED",
            projectId: projectId,
            initiateId: call.claims.username,
            after: application
        }]);

        return this.handleView(result, application, options);
    }

    public async updateApplication(call: AuthenticatedServiceCall<Partial<ApplicationShared>>, options?: Options): Promise<Partial<ApplicationShared>> {
        const result = await this.enforce('update', 'project.application', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const applicationId = call.resourceIds[1];

        const application = await ApplicationModel.query(options?.transaction)
            .patchAndFetchById(applicationId, call.payload)
            .throwIfNotFound();

        return this.handleView(result, application, options);
    }

    public async replyApplication(call: AuthenticatedServiceCall<ResponseShared>, options?: Options): Promise<Partial<ApplicationShared>> {
        const result = await this.enforce('reply', 'project.application', call, options, ...call.resourceIds);

        // allow someone else to hook into our transaction if they so choose, not
        // sure if this will stay
        const transaction = options?.transaction || await Model.startTransaction();
        const events: EventConsumer<ApplicationModel>[] = [];

        const projectId = call.resourceIds[0];
        const applicationId = call.resourceIds[1];

        try {
            const before = await ApplicationModel.query(transaction)
                .findById(applicationId)
                .throwIfNotFound();

            const after = await ApplicationModel.query(transaction)
                .patchAndFetchById(applicationId, 
                    { 
                        responderId: call.claims.username,
                        status: call.payload.response 
                    }
                )
                .throwIfNotFound();

            switch (after.status) {
                case 'ACCEPTED':
                    await MemberModel.query().insert({
                        projectId: projectId,
                        userId: after.userId,
                        contributorId: after.userId,
                        isAdvisor: false
                    })

                    events.push({ 
                        type: "APPLICATION_ACCEPTED",
                        projectId,
                        initiateId: after.responderId,
                        before,
                        after
                    });
                    break;
                
                case 'REJECTED':
                    events.push({
                        type: "APPLICATION_REJECTED",
                        projectId,
                        initiateId: after.responderId,
                        before,
                        after
                    });
                    break;
            }
        
            await transaction.commit();

            this.emitEvents(events);
            return this.handleView(result, after, options);
        } catch (err) {
            await transaction.rollback();
            throw new InternalError();
        }
    }

    public async deleteApplication(call: AuthenticatedServiceCall<object>, options?: Options): Promise<void> {
        const result = await this.enforce('delete', 'project.application', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const applicationId = call.resourceIds[1];

        const application = await ApplicationModel.query()
            .findById(applicationId)
            .throwIfNotFound();

        await ApplicationModel.query(options?.transaction)
            .deleteById(applicationId)
            .throwIfNotFound();

        this.emitEvents([{
            type: "APPLICATION_DELETED",
            projectId,
            initiateId: call.claims.username,
            before: application
        }])
    }

    public async createEntry(call: AuthenticatedServiceCall<Partial<BoardEntryShared>>, options?: Options): Promise<Partial<BoardEntryShared>> {
        const result = await this.enforce('create', 'project.entry', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];

        const entry = await BoardItemModel.query(options?.transaction)
            .insertAndFetch({
                projectId: projectId,
                userId: call.claims.username,
                ...call.payload
            });

        this.emitEvents([{
            type: "ENTRY_CREATED",
            projectId,
            initiateId: call.claims.username,
            after: entry
        }])

        return this.handleView(result, entry, options);
    }

    public async updateEntry(call: AuthenticatedServiceCall<Partial<BoardEntryShared>>, options?: Options): Promise<Partial<BoardEntryShared>> {
        const result = await this.enforce('update', 'project.entry', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const entryId = call.resourceIds[1];

        const before = await BoardItemModel.query()
            .findById(entryId)
            .throwIfNotFound();

        const after = await BoardItemModel.query(options?.transaction)
            .patchAndFetchById(entryId, call.payload)
            .throwIfNotFound();

        this.emitEvents([{
            type: "ENTRY_UPDATED",
            projectId,
            initiateId: call.claims.username,
            before,
            after 
        }])

        return this.handleView(result, after, options);
    }

    public async deleteEntry(call: AuthenticatedServiceCall<object>, options?: Options): Promise<void> {
        const result = await this.enforce('delete', 'project.entry', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const entryId = call.resourceIds[1];

        const entry = await BoardItemModel.query()
            .findById(entryId)
            .throwIfNotFound();

        await BoardItemModel.query(options?.transaction)
            .deleteById(entryId)
            .throwIfNotFound();

        this.emitEvents([{
            type: "ENTRY_DELETED",
            projectId,
            initiateId: call.claims.username,
            before: entry            
        }]);
    }

    public async createInvite(call: MaybeAuthenticatedServiceCall<Partial<InviteShared>>, options?: Options): Promise<Partial<InviteShared>> {
        const result = await this.enforce('create', 'project.invite', call, options, ...call.resourceIds);
        
        const projectId = call.resourceIds[0];

        const invite = await InviteModel.query(options?.transaction)
            .insertAndFetch({
                projectId: projectId,
                initiateId: call.claims!.username,
                status: "PENDING",
                ...call.payload
            });

        this.emitEvents([{
            type: "INVITE_CREATED",
            projectId,
            initiateId: call.claims!.username,
            after: invite       
        }]);

        return this.handleView(result, invite, options);
    }

    public async updateInvite(call: AuthenticatedServiceCall<Partial<InviteShared>>, options?: Options): Promise<Partial<InviteShared>> {
        const result = await this.enforce('update', 'project.invite', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const inviteId = call.resourceIds[1];

        const invite = await InviteModel.query(options?.transaction)
            .patchAndFetchById(inviteId, call.payload)
            .throwIfNotFound();

        return this.handleView(result, invite, options);
    }

    public async replyInvite(call: AuthenticatedServiceCall<ResponseShared>, options?: Options): Promise<Partial<InviteShared>> {
        const result = await this.enforce('reply', 'project.invite', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const inviteId = call.resourceIds[1];

        const before = await InviteModel.query()
            .findById(inviteId)
            .throwIfNotFound()

        const after = await InviteModel.query(options?.transaction)
            .patchAndFetchById(inviteId, { status: call.payload.response })
            .throwIfNotFound();

        const events: EventConsumer<InviteModel>[] = [];

        switch (after.status) {
            case 'ACCEPTED':
                events.push({
                    type: "INVITE_ACCEPTED",
                    projectId,
                    initiateId: after.initiateId,
                    before,
                    after
                });

                switch (after.role) {
                    case "CONTRIBUTOR":
                        await MemberModel.query().insert({
                            projectId,
                            userId: after.targetId,
                            contributorId: after.targetId,
                            isAdvisor: after.isAdvisor
                        })
                        break;
                    case "ADMINISTRATOR":
                        await MemberModel.query().insert({
                            projectId,
                            userId: after.targetId,
                            administratorId: after.targetId,
                            isAdvisor: after.isAdvisor
                        })
                        break;
                }
                break;

            case 'REJECTED':
                events.push({
                    type: "INVITE_REJECTED",
                    projectId,
                    initiateId: call.claims.username,
                    before,
                    after
                });
                break;

            case 'PENDING':
                throw new Error("Invite may only be accepted or rejected");
        }

        this.emitEvents(events);
        return this.handleView(result, after, options);
    }

    public async deleteInvite(call: AuthenticatedServiceCall<object>, options?: Options): Promise<void> {
        const result = await this.enforce('delete', 'project.invite', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const inviteId = call.resourceIds[1];

        const invite = await InviteModel.query()
            .findById(inviteId)
            .throwIfNotFound();

        await InviteModel.query(options?.transaction)
            .deleteById(inviteId)
            .throwIfNotFound();

        this.emitEvents([{
            type: "INVITE_DELETED",
            projectId,
            initiateId: call.claims.username,
            before: invite
        }])
    }

    public async createProject(call: AuthenticatedServiceCall<ProjectModel>, options?: Options): Promise<Partial<ProjectShared>> {
        const result = await this.enforce('create', 'project', call, options, ...call.resourceIds);

        const project = await ProjectModel.query()
            .insertAndFetch({
                acceptingApplications: true,
                coverLink: getDefaultMediaLink(),
                thumbnailLink: getDefaultMediaLink(),
                ...call.payload
            });

        //TODO: for now, the user cannot avoid becoming an advisor if they are faculty
        await MemberModel.query().insert({
            projectId: project.id,
            userId: call.claims.username,
            administratorId: call.claims.username,
            isAdvisor: call.claims.roles.includes("faculty")
        })

        this.emitEvents([{
            type: "PROJECT_CREATED",
            projectId: project.id,
            initiateId: call.claims.username,
            after: project
        }]);

        return this.handleView(result, project, options);
    }

    public async listProjects(call: MaybeAuthenticatedServiceCall<Project.QueryParams>, options?: Options): Promise<Partial<ProjectShared>[]> {
        const result = await this.enforce('list', 'project', call, options, ...call.resourceIds);

        const projects = await filterProjects(call.payload);
        return this.handleView(result, projects, options);
    }

    public async describeProject(call: MaybeAuthenticatedServiceCall<object>, options?: Options): Promise<Partial<ProjectShared>> {
        const result = await this.enforce('describe', 'project', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const project = await ProjectModel.query(options?.transaction)
            .findById(projectId)
            .throwIfNotFound();

        return this.handleView(result, project, options);
    }

    public async updateProject(call: AuthenticatedServiceCall<Partial<ProjectShared>>, options?: Options): Promise<Partial<ProjectShared>> {
        const result = await this.enforce('update', 'project', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];

        const before = await ProjectModel.query(options?.transaction)
            .findById(projectId)
            .throwIfNotFound();

        const after = await ProjectModel.query(options?.transaction)
            .patchAndFetchById(projectId, call.payload)
            .throwIfNotFound();

        this.emitEvents([{
            type: "PROJECT_UPDATED",
            projectId,
            initiateId: call.claims.username,
            before,
            after
        }])

        return this.handleView(result, after, options);
    }

    public async deleteProject(call: AuthenticatedServiceCall<object>, options?: Options): Promise<void> {
        const result = await this.enforce('delete', 'project', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        await ProjectModel.query(options?.transaction)
            .deleteById(projectId)
            .throwIfNotFound();
    }

    public async updateProjectMember(call: MaybeAuthenticatedServiceCall<Membership>, options?: Options): Promise<void> {
        const result = await this.enforce('update', 'project.member', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const userId = call.resourceIds[1];

        const membership = await describeMembership(projectId, userId);

        // TODO: thread this into the same transaction
        // requires an invite due to some promotion of the user
        if ((membership!.role === "CONTRIBUTOR" && call.payload.role === "ADMINISTRATOR") || (!membership!.isAdvisor && call.payload.isAdvisor)) {
            
            // assert that the user can elevate to advisor status
            if (!membership!.isAdvisor && call.payload.isAdvisor) {
                const target = await this.describeUser(
                    {
                        payload: {},
                        resourceIds: [ userId ]
                    }, 
                    {
                        asAdmin: true,
                        noRelations: true
                    }
                )

                if (!target.roles?.includes("faculty")) {
                    throw new AuthorizationError("Target is not capable of becoming an advisor");
                }
            }

            await this.createInvite(
                {
                    payload: {
                        id: uuid(),
                        initiateId: call.claims!.username,
                        targetId: userId,
                        role: call.payload.role,
                        isAdvisor: call.payload.isAdvisor,
                        note: "(This is an auto-generated invite via a promotion request)"
        
                    },
                    claims: call.claims,
                    resourceIds: [ projectId ]
                }, 
                {
                    noRelations: true
                }
            )
        }

        // must be a demotion, equal movements are prevented by the enforcer
        else {
            await MemberModel.query().deleteById([ projectId, userId ]);

            if (membership!.role === "ADMINISTRATOR" && call.payload.role === "CONTRIBUTOR") {
                await MemberModel.query().insert({
                    projectId,
                    userId,
                    contributorId: userId,
                    isAdvisor: call.payload.isAdvisor
                })
            } else {
                await MemberModel.query().insert({
                    projectId,
                    userId,
                    administratorId: userId,
                    isAdvisor: call.payload.isAdvisor
                })
            }
        }
    }

    public async deleteProjectMember(call: MaybeAuthenticatedServiceCall<object>, options?: Options): Promise<void> {
        const result = await this.enforce('delete', 'project.member', call, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const userId = call.resourceIds[1];

        await MemberModel.query().deleteById([ projectId, userId ])
            .throwIfNotFound()
    }

    public async createUser(call: AuthenticatedServiceCall<Partial<UserShared>>, options?: Options): Promise<Partial<UserShared>> {
        const result = await this.enforce('create', 'user', call, options, ...call.resourceIds);

        const userId = call.resourceIds[0];
        const user = await UserModel.query(options?.transaction)
            .insertAndFetch(call.payload)

        return this.handleView(result, user, options);
    }

    public async describeUser(call: MaybeAuthenticatedServiceCall<object>, options?: Options): Promise<Partial<UserShared>> {
        const result = await this.enforce('describe', 'user', call, options, ...call.resourceIds);

        const userId = call.resourceIds[0];
        const user = await UserModel.query(options?.transaction)
            .findById(userId)
            .throwIfNotFound();

        return this.handleView(result, user, options);
    }

    public async updateUser(call: AuthenticatedServiceCall<Partial<UserShared>>, options?: Options): Promise<Partial<UserShared>> {
        const result = await this.enforce('update', 'user', call, options, ...call.resourceIds);
        
        const userId = call.resourceIds[0];
        const user = await UserModel.query()
            .patchAndFetchById(userId, call.payload)
            .throwIfNotFound();

        return this.handleView(result, user, options);
    }

    public async createUserStar(call: AuthenticatedServiceCall<object>, options?: Options): Promise<void> {
        const result = await this.enforce('create', 'user.star', call, options, ...call.resourceIds);

        const userId = call.resourceIds[0];
        const projectId = call.resourceIds[1];

        await UserModel.relatedQuery("starred")
            .for(userId)
            .relate(projectId);
    }

    public async deleteUserStar(call: AuthenticatedServiceCall<object>, options?: Options): Promise<void> {
        const result = await this.enforce('delete', 'user.star', call, options, ...call.resourceIds);

        const userId = call.resourceIds[0];
        const projectId = call.resourceIds[1];

        await UserModel.relatedQuery("starred")
            .for(userId)
            .where("projectId", projectId)
            .unrelate();
    }

    public async updateUserAvatar(call: AuthenticatedServiceCall<CreateImageMedia>): Promise<Partial<S3.PresignedPost>> {
        await this.enforce('update', 'user.avatar', call, undefined, ...call.resourceIds);

        const userId = call.resourceIds[0];

        return this.mediaRequestFactory.knownFileRequest({
            bucket: 'marqetplace-staging-photos',
            key: `users/${userId}/avatar`,
            type: call.payload.type
        });
    }

    public async updateUserResume(call: AuthenticatedServiceCall<CreateDocumentMedia>): Promise<Partial<S3.PresignedPost>> {
        await this.enforce('update', 'user.resume', call, undefined, ...call.resourceIds);

        const userId = call.resourceIds[0];

        return this.mediaRequestFactory.knownFileRequest({
            bucket: 'marqetplace-staging-photos',
            key: `users/${userId}/resume`,
            type: call.payload.type
        })
    }

    // Events for these are tricky, as they should be generated by the media handler,
    // which operates in a separate process.  Would need a distributed event broker.
    public async updateProjectThumbnail(call: AuthenticatedServiceCall<CreateImageMedia>): Promise<Partial<S3.PresignedPost>> {
        await this.enforce('update', 'project.thumbnail', call, undefined, ...call.resourceIds);

        const projectId = call.resourceIds[0];

        return this.mediaRequestFactory.knownFileRequest({
            bucket: 'marqetplace-staging-photos',
            key: `projects/${projectId}/thumbnail`,
            type: call.payload.type
        });
    }

    public async updateProjectCover(call: AuthenticatedServiceCall<CreateImageMedia>): Promise<Partial<S3.PresignedPost>> {
        await this.enforce('update', 'project.cover', call, undefined, ...call.resourceIds);

        const projectId = call.resourceIds[0];

        return this.mediaRequestFactory.knownFileRequest({
            bucket: `marqetplace-staging-photos`,
            key: `projects/${projectId}/cover`,
            type: call.payload.type
        });
    }

    public async updateProjectEntryMedia(call: AuthenticatedServiceCall<CreateBoardMedia>): Promise<Partial<S3.PresignedPost>> {
        await this.enforce('update', 'project.entry.media', call, undefined, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const entryId = call.resourceIds[1];

        return this.mediaRequestFactory.knownFileRequest({
            bucket: `marqetplace-staging-photos`,
            key: `projects/${projectId}/board/${entryId}`,
            type: call.payload.type
        });
    }

    private async enforce<T extends object>(action: Actions, resource: Resources, call: MaybeAuthenticatedServiceCall<T>, options?: Options, ...resourceIds: string[]): Promise<EnforcementResult>;
    private async enforce<T extends object>(action: Actions, resource: Resources, call: AuthenticatedServiceCall<T>, options?: Options, ...resourceIds: string[]): Promise<EnforcementResult>;
    private async enforce<T extends object>(action: Actions, resource: Resources, call: MaybeAuthenticatedServiceCall<T> | AuthenticatedServiceCall<T>, options?: Options, ...resourceIds: string[]): Promise<EnforcementResult> {
        if (options?.asAdmin) return { view: 'full' };

        const result = await this.enforcer.enforce(action, resource, call, ...resourceIds);
        this.handleErrors(result);

        return result;
    }

    private handleErrors(enforcement: EnforcementResult) {
        switch (enforcement.view) {
            case 'error':
                throw new AuthenticationError();
            case 'hidden':
                throw new NotFoundError();
            case 'blocked':
                throw new AuthorizationError();
            default:
                return;
        }
    }

    //TODO: these should never be part of a transaction
    private handleView(enforcement: EnforcementResult, instance: ViewableModel, options?: Options);
    private handleView(enforcement: EnforcementResult, instances: ViewableModel[], options?: Options);
    private async handleView(enforcement: EnforcementResult, instances: ViewableModel | ViewableModel[], options?: Options): Promise<object> {
        if (Array.isArray(instances)) return Promise.all(instances.map(instance => this.handleView(enforcement, instance, options)));
        if (options?.noRelations) return instances;
        switch (enforcement.view) {
            case 'partial':
                return (await instances.getPartialView(options?.transaction)).toJSON();
            case 'verbose':
                return (await instances.getVerboseView(options?.transaction)).toJSON();
            case 'full':
                return (await instances.getFullView(options?.transaction)).toJSON();
            default:
                throw new InternalError();
        }
    }

    private emitEvents<T extends ViewableModel>(events: (HistoryEventConsumer<T> | NotificationEventConsumer<T>)[]) {
        events.map(event => {
            this.emitter.emit(event.type, event) // happen to match the event name
        })
    }
}
