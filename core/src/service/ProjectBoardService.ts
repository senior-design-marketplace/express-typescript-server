import { EventEmitter } from 'events';
import { Actions, EnforcerService, PolicyApplicationFailedError } from '../../../external/enforcer/src/EnforcerService';
import { Resources } from '../../../external/enforcer/src/resources/resources';
import { CreateBoardEntryQuery } from '../access/queries/CreateBoardEntryQuery';
import { DeleteBoardEntryQuery } from '../access/queries/DeleteBoardEntryQuery';
import { DescribeBoardEntryQuery } from '../access/queries/DescribeBoardEntryQuery';
import { UpdateBoardEntryQuery } from '../access/queries/UpdateBoardEntryQuery';
import { AuthorizationError } from '../error/error';
import { BoardEntryImmutable } from '../schemas/types/ProjectBoard/BoardEntryImmutable';
import { BoardEntryMaster } from '../schemas/types/ProjectBoard/BoardEntryMaster';
import { BoardEntryMutable } from '../schemas/types/ProjectBoard/BoardEntryMutable';
import { TranslateErrors } from './decorators';
import * as Utils from './util';

type CreateBoardEntryParams = Utils.AuthenticatedSingleResourceServiceCall<BoardEntryImmutable>;
type UpdateBoardEntryParams = Utils.AuthenticatedNestedResourceServiceCall<BoardEntryMutable>;
type DeleteBoardEntryParams = Utils.AuthenticatedNestedResourceServiceCall<null>;

export default class ProjectBoardService {

    constructor(
        private readonly emitter: EventEmitter,
        private readonly enforcer: EnforcerService<Resources, Actions>,
        private readonly createBoardEntryQuery: CreateBoardEntryQuery,
        private readonly describeBoardEntryQuery: DescribeBoardEntryQuery,
        private readonly updateBoardEntryQuery: UpdateBoardEntryQuery,
        private readonly deleteBoardEntryQuery: DeleteBoardEntryQuery) {}

    @TranslateErrors([ PolicyApplicationFailedError ], AuthorizationError)
    public async createBoardEntry(params: CreateBoardEntryParams): Promise<BoardEntryMaster> {
        await this.enforcer.enforce(
            params.claims,
            'create',
            'entry',
            params.resourceId
        );

        return this.createBoardEntryQuery.execute({
            userId: params.claims.username,
            projectId: params.resourceId,
            payload: params.payload
        });
    }

    @TranslateErrors([ PolicyApplicationFailedError ], AuthorizationError)
    public async updateBoardEntry(params: UpdateBoardEntryParams): Promise<BoardEntryMaster> {
        await this.enforcer.enforce(
            params.claims,
            'update',
            'entry',
            params.outerResourceId,
            params.innerResourceId
        );

        return this.updateBoardEntryQuery.execute({
            payload: params.payload,
            outerResourceId: params.outerResourceId,
            innerResourceId: params.innerResourceId
        });
    }

    @TranslateErrors([ PolicyApplicationFailedError ], AuthorizationError)
    public async deleteBoardEntry(params: DeleteBoardEntryParams): Promise<void> {
        await this.enforcer.enforce(
            params.claims,
            'delete',
            'entry',
            params.outerResourceId,
            params.innerResourceId
        );

        return this.deleteBoardEntryQuery.execute({
            projectId: params.outerResourceId,
            entryId: params.innerResourceId
        });
    }
}