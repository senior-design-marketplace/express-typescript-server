import { S3 } from "aws-sdk";
import { Transaction, UniqueViolationError } from "objection";
import { Claims } from "../../../core/src/auth/verify";
import AdministratorModel from "./models/AdministratorModel";
import ApplicationModel from "./models/ApplicationModel";
import BoardItemModel from "./models/BoardItemModel";
import CommentModel from "./models/CommentModel";
import ContributorModel from "./models/ContributorModel";
import InviteModel from "./models/InviteModel";
import MajorModel from "./models/MajorModel";
import { NotificationModel } from "./models/NotificationModel";
import ProjectModel from "./models/ProjectModel";
import TagModel from "./models/TagModel";
import UserModel from "./models/UserModel";
import { Viewable } from "./models/Viewable";
import { MediaRequestFactory } from "./MediaRequestFactory";
import { AuthenticationError, AuthorizationError, NotFoundError } from "../../../core/src/error/error";
import { ApplicationShared } from "../../../lib/types/shared/ApplicationShared";
import { BoardEntryShared } from "../../../lib/types/shared/BoardEntryShared";
import { CommentShared } from "../../../lib/types/shared/CommentShared";
import { InviteShared } from "../../../lib/types/shared/InviteShared";
import { NotificationShared } from "../../../lib/types/shared/NotificationShared";
import { ProjectShared } from "../../../lib/types/shared/ProjectShared";
import { UserShared } from "../../../lib/types/shared/UserShared";
import { Strip, Suppress } from "./decorators";
import { Actions, EnforcementResult, Enforcer } from "./Enforcer";
import { Resources } from "./resources/resources";
import { MajorShared } from "../../../lib/types/shared/MajorShared";
import { TagShared } from "../../../lib/types/shared/TagShared";
import { Major } from "../../../lib/types/base/Major";
import { Tag } from "../../../lib/types/base/Tag";
import { ResponseShared } from "../../../lib/types/shared/ResponseShared";
import { Image } from "../../../lib/types/base/Image";
import { AllowedMedia } from "../../../lib/types/base/AllowedMedia";
import { Project } from "./types/Project";

export type Options = {
    asAdmin?: boolean,
    noRelations?: boolean,
    transaction?: Transaction
}

export type MaybeAuthenticatedServiceCall<T> = {
    claims?: Claims,
    payload: T,
    resourceIds: string[]
}

export type AuthenticatedServiceCall<T> = Required<MaybeAuthenticatedServiceCall<T>>;

type KeysMatching<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];
export type NoRelation<T> = Omit<T, KeysMatching<T, any[] | object>>;

export class EnforcerService {

    constructor(
        private enforcer: Enforcer<Resources, Actions>,
        private mediaRequestFactory: MediaRequestFactory) {}

    //TODO: we might want some types for contributors and administrators here, especially if they have extra properties
    @Suppress(UniqueViolationError)
    private async createContributor(projectId: string, userId: string, options?: Options): Promise<void> {
        await ContributorModel.query(options?.transaction)
            .insert({ projectId, userId });
    }

    @Suppress(NotFoundError)
    private async deleteContributor(projectId: string, userId: string, options?: Options): Promise<void> {
        await ContributorModel.query(options?.transaction)
            .deleteById([ projectId, userId ]);
    }

    //TODO: for now, nobody is an advisor
    @Suppress(UniqueViolationError)
    private async createAdministrator(projectId: string, userId: string, options?: Options): Promise<void> {
        await AdministratorModel.query(options?.transaction)
            .insert({ projectId: projectId, userId: userId, isAdvisor: false });
    }

    @Suppress(NotFoundError)
    private async deleteAdministrator(projectId: string, userId: string, options?: Options): Promise<void> {
        await AdministratorModel.query(options?.transaction)
            .deleteById([ projectId, userId ]);
    }

    @Strip()
    public async listMajors(call: MaybeAuthenticatedServiceCall<null>, options?: Options): Promise<MajorShared[]> {
        const result: EnforcementResult = { view: 'full' }; // unauthenticated methods by default return full view

        const majors = await MajorModel.query(options?.transaction);
        return this.handleView(result, majors, options);
    }

    @Strip()
    public async updateMajors(call: AuthenticatedServiceCall<Major[]>, options?: Options): Promise<MajorShared[]> {
        const result = await this.enforce('update', 'project.majors', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];

        const project = await ProjectModel.query(options?.transaction)
            .findById(projectId)
            .throwIfNotFound();

        await project.$relatedQuery('requestedMajors', options?.transaction)
            .unrelate();

        await project.$relatedQuery('requestedMajors', options?.transaction)
            .relate(call.payload);

        const majors = await project.$relatedQuery('requestedMajors', options?.transaction);
        return this.handleView(result, majors, options);
    }

    @Strip()
    public async listTags(call: MaybeAuthenticatedServiceCall<null>, options?: Options): Promise<TagShared[]> {
        const result: EnforcementResult = { view: 'full' };

        const tags = await TagModel.query(options?.transaction);
        return this.handleView(result, tags, options);
    }

    @Strip()
    public async updateTags(call: AuthenticatedServiceCall<Tag[]>, options?: Options): Promise<TagShared[]> {
        const result = await this.enforce('update', 'project.tags', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];

        const project = await ProjectModel.query(options?.transaction)
            .findById(projectId)
            .throwIfNotFound();

        await project.$relatedQuery('tags', options?.transaction)
            .unrelate();

        await project.$relatedQuery('tags', options?.transaction)
            .relate(call.payload);

        const tags = await project.$relatedQuery('tags', options?.transaction);
        return this.handleView(result, tags, options);
    }    

    @Strip()
    public async createComment(call: AuthenticatedServiceCall<Partial<NoRelation<CommentShared>>>, options?: Options): Promise<Partial<CommentShared>> {
        const result = await this.enforce('create', 'project.comment', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];

        const comment = await CommentModel.query(options?.transaction)
            .insertAndFetch({
                projectId: projectId,
                userId: call.claims.username,
                ...call.payload
            });

        return this.handleView(result, comment, options);
    }

    @Strip()
    public async updateComment(call: AuthenticatedServiceCall<Partial<NoRelation<CommentShared>>>, options?: Options): Promise<Partial<CommentShared>> {
        const result = await this.enforce('update', 'project.comment', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const commentId = call.resourceIds[1];

        const comment = await CommentModel.query(options?.transaction)
            .patchAndFetchById(commentId, call.payload)
            .throwIfNotFound();

        return this.handleView(result, comment, options);
    }

    @Strip()
    public async replyComment(call: AuthenticatedServiceCall<Partial<NoRelation<CommentShared>>>, options?: Options): Promise<Partial<CommentShared>> {
        const result = await this.enforce('reply', 'project.comment', call.claims, options, ...call.resourceIds);

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

    public async deleteComment(call: AuthenticatedServiceCall<null>, options?: Options): Promise<void> {
        const result = await this.enforce('delete', 'project.comment', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const commentId = call.resourceIds[1];

        await CommentModel.query(options?.transaction)
            .deleteById(commentId)
            .throwIfNotFound();
    }

    @Strip()
    public async createNotification(call: AuthenticatedServiceCall<Partial<NoRelation<NotificationShared>>>, options?: Options): Promise<Partial<NotificationShared>> {
        const result = await this.enforce('create', 'user.notification', call.claims, options, ...call.resourceIds);

        const notification = await NotificationModel.query(options?.transaction)
            .insertAndFetch({
                read: false,
                ...call.payload
            });

        return this.handleView(result, notification, options);
    }

    @Strip()
    public async updateNotification(call: AuthenticatedServiceCall<Partial<NoRelation<NotificationShared>>>, options?: Options): Promise<Partial<NotificationShared>> {
        const result = await this.enforce('update', 'user.notification', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const notificationId = call.resourceIds[1];

        const notification = await NotificationModel.query(options?.transaction)
            .patchAndFetchById(notificationId, { read: call.payload.read })
            .throwIfNotFound();

        return this.handleView(result, notification, options);
    }

    public async deleteNotification(call: AuthenticatedServiceCall<null>, options?: Options): Promise<void> {
        const result = await this.enforce('delete', 'user.notification', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const notificationId = call.resourceIds[1];

        await NotificationModel.query(options?.transaction)
            .deleteById(notificationId)
            .throwIfNotFound();
    }

    @Strip()
    public async createApplication(call: AuthenticatedServiceCall<Partial<NoRelation<ApplicationShared>>>, options?: Options): Promise<Partial<ApplicationShared>> {
        const result = await this.enforce('create', 'project.application', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];

        const application = await ApplicationModel.query(options?.transaction)
            .insertAndFetch({
                projectId: projectId,
                userId: call.claims.username,
                status: 'PENDING',
                ...call.payload
            });

        return this.handleView(result, application, options);
    }

    @Strip()
    public async updateApplication(call: AuthenticatedServiceCall<Partial<NoRelation<ApplicationShared>>>, options?: Options): Promise<Partial<ApplicationShared>> {
        const result = await this.enforce('update', 'project.application', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const applicationId = call.resourceIds[1];

        const application = await ApplicationModel.query(options?.transaction)
            .patchAndFetchById(applicationId, call.payload)
            .throwIfNotFound();

        return this.handleView(result, application, options);
    }

    @Strip()
    public async replyApplication(call: AuthenticatedServiceCall<ResponseShared>, options?: Options): Promise<Partial<ApplicationShared>> {
        const result = await this.enforce('reply', 'project.application', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const applicationId = call.resourceIds[1];

        const application = await ApplicationModel.query(options?.transaction)
            .patchAndFetchById(applicationId, { status: call.payload.response })
            .throwIfNotFound();

        switch (application.status) {
            case 'ACCEPTED':
                await this.createContributor(projectId, application.userId);
                break;
            case 'REJECTED':
                break;
            case 'PENDING':
                throw new Error("Application may only be accepted or rejected");
        }

        return this.handleView(result, application, options);
    }

    public async deleteApplication(call: AuthenticatedServiceCall<null>, options?: Options): Promise<void> {
        const result = await this.enforce('delete', 'project.application', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const applicationId = call.resourceIds[1];

        await ApplicationModel.query(options?.transaction)
            .deleteById(applicationId)
            .throwIfNotFound();
    }

    @Strip()
    public async createEntry(call: AuthenticatedServiceCall<Partial<NoRelation<BoardEntryShared>>>, options?: Options): Promise<Partial<BoardEntryShared>> {
        const result = await this.enforce('create', 'project.entry', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];

        const entry = await BoardItemModel.query(options?.transaction)
            .insertAndFetch({
                projectId: projectId,
                userId: call.claims.username,
                ...call.payload
            });

        return this.handleView(result, entry, options);
    }

    @Strip()
    public async updateEntry(call: AuthenticatedServiceCall<Partial<NoRelation<BoardEntryShared>>>, options?: Options): Promise<Partial<BoardEntryShared>> {
        const result = await this.enforce('update', 'project.entry', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const entryId = call.resourceIds[1];

        const entry = await BoardItemModel.query(options?.transaction)
            .patchAndFetchById(entryId, call.payload)
            .throwIfNotFound();

        return this.handleView(result, entry, options);
    }

    public async deleteEntry(call: AuthenticatedServiceCall<null>, options?: Options): Promise<void> {
        const result = await this.enforce('delete', 'project.entry', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const entryId = call.resourceIds[1];

        await BoardItemModel.query(options?.transaction)
            .deleteById(entryId)
            .throwIfNotFound();
    }

    @Strip()
    public async createInvite(call: AuthenticatedServiceCall<Partial<NoRelation<InviteShared>>>, options?: Options): Promise<Partial<InviteShared>> {
        const result = await this.enforce('create', 'project.invite', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];

        const invite = await InviteModel.query(options?.transaction)
            .insertAndFetch({
                projectId: projectId,
                initiateId: call.claims.username,
                status: "PENDING",
                ...call.payload
            });

        return this.handleView(result, invite, options);
    }

    @Strip()
    public async updateInvite(call: AuthenticatedServiceCall<Partial<NoRelation<InviteShared>>>, options?: Options): Promise<Partial<InviteShared>> {
        const result = await this.enforce('update', 'project.invite', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const inviteId = call.resourceIds[1];

        const invite = await InviteModel.query(options?.transaction)
            .patchAndFetchById(inviteId, call.payload)
            .throwIfNotFound();

        return this.handleView(result, invite, options);
    }

    @Strip()
    public async replyInvite(call: AuthenticatedServiceCall<ResponseShared>, options?: Options): Promise<Partial<InviteShared>> {
        const result = await this.enforce('reply', 'project.invite', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const inviteId = call.resourceIds[1];

        const invite = await InviteModel.query(options?.transaction)
            .patchAndFetchById(inviteId, { status: call.payload.response })
            .throwIfNotFound();

        switch (invite.status) {
            case 'ACCEPTED':
                switch (invite.role) {
                    // TODO: on the invite policy, assure that the targeted user can elevate to the given role.
                    case 'CONTRIBUTOR':
                        await this.createContributor(projectId, invite.targetId, options);
                        break;
                    case 'ADMINISTRATOR':
                        await this.createAdministrator(projectId, invite.targetId, options);
                        break;
                    case 'ADVISOR':
                        await this.createAdministrator(projectId, invite.targetId, options); // TODO: update model so we can construct it.
                        break;
                }
                break;
            case 'REJECTED':
                break;
            case 'PENDING':
                throw new Error("Invite may only be accepted or rejected");
        }

        return this.handleView(result, invite, options);
    }

    public async deleteInvite(call: AuthenticatedServiceCall<null>, options?: Options): Promise<void> {
        const result = await this.enforce('delete', 'project.invite', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const inviteId = call.resourceIds[1];

        await InviteModel.query(options?.transaction)
            .deleteById(inviteId)
            .throwIfNotFound();
    }

    @Strip()
    public async createProject(call: AuthenticatedServiceCall<Partial<NoRelation<ProjectShared>>>, options?: Options): Promise<Partial<ProjectShared>> {
        const result = await this.enforce('create', 'project', call.claims, options, ...call.resourceIds);

        //TODO: insert the image links
        const project = await ProjectModel.query()
            .insertAndFetch({
                acceptingApplications: true,
                coverLink: "",
                thumbnailLink: "",
                ...call.payload
            });

        // user then becomes an administrator of the project
        await this.createAdministrator(project.id, call.claims.username, options);

        return this.handleView(result, project, options);
    }

    @Strip()
    public async listProjects(call: MaybeAuthenticatedServiceCall<Project.QueryParams>, options?: Options): Promise<Partial<ProjectShared>[]> {
        const result = await this.enforce('list', 'project', call.claims, options, ...call.resourceIds);

        // TODO: enforce query parameters for filtering
        const projects = await ProjectModel.query();
        return this.handleView(result, projects, options);
    }

    @Strip()
    public async describeProject(call: MaybeAuthenticatedServiceCall<null>, options?: Options): Promise<Partial<ProjectShared>> {
        const result = await this.enforce('describe', 'project', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const project = await ProjectModel.query(options?.transaction)
            .findById(projectId)
            .throwIfNotFound();

        return this.handleView(result, project, options);
    }

    @Strip()
    public async updateProject(call: AuthenticatedServiceCall<Partial<NoRelation<ProjectShared>>>, options?: Options): Promise<Partial<ProjectShared>> {
        const result = await this.enforce('update', 'project', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        const project = await ProjectModel.query(options?.transaction)
            .patchAndFetchById(projectId, call.payload)
            .throwIfNotFound();

        return this.handleView(result, project, options);
    }

    public async deleteProject(call: AuthenticatedServiceCall<null>, options?: Options): Promise<void> {
        const result = await this.enforce('delete', 'project', call.claims, options, ...call.resourceIds);

        const projectId = call.resourceIds[0];
        await ProjectModel.query(options?.transaction)
            .deleteById(projectId)
            .throwIfNotFound();
    }

    @Strip()
    public async createUser(call: AuthenticatedServiceCall<Partial<NoRelation<UserShared>>>, options?: Options): Promise<Partial<UserShared>> {
        const result = await this.enforce('create', 'user', call.claims, options, ...call.resourceIds);

        const userId = call.resourceIds[0];
        const user = await UserModel.query(options?.transaction)
            .insertAndFetch(call.payload)

        return this.handleView(result, user, options);
    }

    @Strip()
    public async describeUser(call: MaybeAuthenticatedServiceCall<null>, options?: Options): Promise<Partial<UserShared>> {
        const result = await this.enforce('describe', 'user', call.claims, options, ...call.resourceIds);

        const userId = call.resourceIds[0];
        const user = await UserModel.query(options?.transaction)
            .findById(userId)
            .throwIfNotFound();

        return this.handleView(result, user, options);
    }

    @Strip()
    public async updateUser(call: AuthenticatedServiceCall<Partial<NoRelation<UserShared>>>, options?: Options): Promise<Partial<UserShared>> {
        const result = await this.enforce('update', 'user', call.claims, options, ...call.resourceIds);
        
        const userId = call.resourceIds[0];
        const user = await UserModel.query()
            .patchAndFetchById(userId, call.payload)
            .throwIfNotFound();

        return this.handleView(result, user, options);
    }

    public async updateUserAvatar(call: AuthenticatedServiceCall<{ type: Image }>): Promise<Partial<S3.PresignedPost>> {
        const result = await this.enforce('update', 'user.avatar', call.claims, undefined, ...call.resourceIds);
        this.handleErrors(result);

        const userId = call.resourceIds[0];

        return this.mediaRequestFactory.knownFileRequest({
            bucket: 'marqetplace-staging-photos',
            key: `users/${userId}/avatar`,
            type: call.payload.type
        });
    }

    public async updateProjectThumbnail(call: AuthenticatedServiceCall<{ type: Image }>): Promise<Partial<S3.PresignedPost>> {
        const result = await this.enforce('update', 'project.thumbnail', call.claims, undefined, ...call.resourceIds);
        this.handleErrors(result);

        const projectId = call.resourceIds[0];

        return this.mediaRequestFactory.knownFileRequest({
            bucket: 'marqetplace-staging-photos',
            key: `projects/${projectId}/thumbnail`,
            type: call.payload.type
        });
    }

    public async updateProjectCover(call: AuthenticatedServiceCall<{ type: Image }>): Promise<Partial<S3.PresignedPost>> {
        const result = await this.enforce('update', 'project.cover', call.claims, undefined, ...call.resourceIds);
        this.handleErrors(result);

        const projectId = call.resourceIds[0];

        return this.mediaRequestFactory.knownFileRequest({
            bucket: `marqetplace-staging-photos`,
            key: `projects/${projectId}/cover`,
            type: call.payload.type
        });
    }

    public async updateProjectEntryMedia(call: AuthenticatedServiceCall<{ type: AllowedMedia }>): Promise<Partial<S3.PresignedPost>> {
        const result = await this.enforce('update', 'project.entry.media', call.claims, undefined, ...call.resourceIds);
        this.handleErrors(result);

        const projectId = call.resourceIds[0];
        const entryId = call.resourceIds[1];

        return this.mediaRequestFactory.knownFileRequest({
            bucket: `marqetplace-staging-photos`,
            key: `projects/${projectId}/board/${entryId}`,
            type: call.payload.type
        });
    }

    private async enforce(action: Actions, resource: Resources, claims?: Claims, options?: Options, ...resourceIds: string[]): Promise<EnforcementResult> {
        if (options?.asAdmin) return { view: 'full' };

        return this.enforcer.enforce(action, resource, claims, ...resourceIds);
    }

    private handleErrors(enforcement: EnforcementResult) {
        switch (enforcement.view) {
            case 'error':
                throw new AuthenticationError('Authentication required');
            case 'hidden':
                throw new NotFoundError('Resource not found');
            case 'blocked':
                throw new AuthorizationError('User does not have appropriate credentials');
            default:
                return;
        }
    }

    private handleView<T, U, V>(enforcement: EnforcementResult, instance: Viewable<T, U, V>, options?: Options);
    private handleView<T, U, V>(enforcement: EnforcementResult, instances: Viewable<T, U, V>[], options?: Options);
    private handleView<T, U, V>(enforcement: EnforcementResult, instances: Viewable<T, U, V> | Viewable<T, U, V>[], options?: Options) {
        if (Array.isArray(instances)) return Promise.all(instances.map(instance => this.handleView(enforcement, instance, options)));
        this.handleErrors(enforcement);

        if (options?.noRelations) return instances;
        switch (enforcement.view) {
            case 'partial':
                return instances.getPartialView(options?.transaction);
            case 'verbose':
                return instances.getVerboseView(options?.transaction);
            case 'full':
                return instances.getFullView(options?.transaction);
        }
    }
}