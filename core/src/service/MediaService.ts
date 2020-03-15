import { S3 } from "aws-sdk";
import { EventEmitter } from "events";
import { MediaRequestFactory } from "../controllers/mediaRequestFactory";
import { AuthorizationError } from "../error/error";
import { BoardMediaImmutable } from "../schemas/types/Media/BoardMediaImmutable";
import { ImageMediaImmutable } from "../schemas/types/Media/ImageMediaImmutable";
import { TranslateErrors } from "./decorators";
import { Actions, EnforcerService, PolicyApplicationFailedError } from "./enforcer/EnforcerService";
import { Resources } from "./enforcer/resources/resources";
import * as Utils from './util';

type UpdateAvatarParams = Utils.AuthenticatedSingleResourceServiceCall<ImageMediaImmutable>;
type UpdateCoverParams = Utils.AuthenticatedSingleResourceServiceCall<ImageMediaImmutable>;
type UpdateThumbnailParams = Utils.AuthenticatedSingleResourceServiceCall<ImageMediaImmutable>;
type UpdateBoardMediaParams = Utils.AuthenticatedNestedResourceServiceCall<BoardMediaImmutable>;

export class MediaService {

    constructor(
        private readonly emitter: EventEmitter,
        private readonly enforcer: EnforcerService<Resources, Actions>,
        private readonly requestFactory: MediaRequestFactory) {}

    @TranslateErrors([ PolicyApplicationFailedError ], AuthorizationError)
    public async updateAvatar(params: UpdateAvatarParams): Promise<Partial<S3.PresignedPost>> {
        await this.enforcer.enforce(
            params.claims,
            'update',
            'user.avatar',
            params.resourceId
        )
        
        return this.requestFactory.knownFileRequest({
            bucket: 'marqetplace-staging-photos',
            key: `users/${params.resourceId}/avatar`,
            type: params.payload.type
        })
    }

    @TranslateErrors([ PolicyApplicationFailedError ], AuthorizationError)
    public async updateCover(params: UpdateCoverParams): Promise<Partial<S3.PresignedPost>> {
        await this.enforcer.enforce(
            params.claims,
            'update',
            'project.cover',
            params.resourceId
        )
        
        return this.requestFactory.knownFileRequest({
            bucket: 'marqetplace-staging-photos',
            key: `projects/${params.resourceId}/cover`,
            type: params.payload.type
        })
    }

    @TranslateErrors([ PolicyApplicationFailedError ], AuthorizationError)
    public async updateThumbnail(params: UpdateThumbnailParams): Promise<Partial<S3.PresignedPost>> {
        await this.enforcer.enforce(
            params.claims,
            'update',
            'project.thumbnail',
            params.resourceId
        )
        
        return this.requestFactory.knownFileRequest({
            bucket: 'marqetplace-staging-photos',
            key: `projects/${params.resourceId}/thumbnail`,
            type: params.payload.type
        })
    }

    @TranslateErrors([ PolicyApplicationFailedError ], AuthorizationError)
    public async updateBoardMedia(params: UpdateBoardMediaParams): Promise<Partial<S3.PresignedPost>> {
        await this.enforcer.enforce(
            params.claims,
            'update',
            'entry',
            params.outerResourceId,
            params.innerResourceId
        )
        
        return this.requestFactory.knownFileRequest({
            bucket: 'marqetplace-staging-photos',
            key: `projects/${params.outerResourceId}/board/${params.innerResourceId}`,
            type: params.payload.type
        })
    }
}