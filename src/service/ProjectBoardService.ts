import { EventEmitter } from 'events';
import { CreateBoardEntryQuery } from '../access/queries/CreateBoardEntryQuery';
import { DeleteBoardEntryQuery } from '../access/queries/DeleteBoardEntryQuery';
import { DescribeBoardEntryQuery } from '../access/queries/DescribeBoardEntryQuery';
import { UpdateBoardEntryQuery } from '../access/queries/UpdateBoardEntryQuery';
import { BoardEntryImmutable } from '../schemas/types/ProjectBoard/BoardEntryImmutable';
import { BoardEntryMaster } from '../schemas/types/ProjectBoard/BoardEntryMaster';
import { BoardEntryMutable } from '../schemas/types/ProjectBoard/BoardEntryMutable';
import * as Utils from './util';

type CreateBoardEntryParams = Utils.AuthenticatedSingleResourceServiceCall<BoardEntryImmutable>;
type UpdateBoardEntryParams = Utils.AuthenticatedNestedResourceServiceCall<BoardEntryMutable>;
type DeleteBoardEntryParams = Utils.AuthenticatedNestedResourceServiceCall<null>;

export default class ProjectBoardService {

    constructor(
        private readonly emitter: EventEmitter,
        private readonly createBoardEntryQuery: CreateBoardEntryQuery,
        private readonly describeBoardEntryQuery: DescribeBoardEntryQuery,
        private readonly updateBoardEntryQuery: UpdateBoardEntryQuery,
        private readonly deleteBoardEntryQuery: DeleteBoardEntryQuery) {}

    public async createBoardEntry(params: CreateBoardEntryParams): Promise<BoardEntryMaster> {
        return this.createBoardEntryQuery.execute({ ...params.payload });
    }

    public async updateBoardEntry(params: UpdateBoardEntryParams): Promise<BoardEntryMaster> {
        const response = await this.describeBoardEntryQuery.execute({
            entryId: params.innerResourceId
        })

        // leaving as swtich to facilitate extension
        switch (response.entry.type) {
            case "MEDIA":
                throw "Cannot update a media document";
            case "TEXT":
                break;
        }

        return this.updateBoardEntryQuery.execute({
            payload: params.payload,
            outerResourceId: params.outerResourceId,
            innerResourceId: params.innerResourceId
        });
    }

    public async deleteBoardEntry(params: DeleteBoardEntryParams): Promise<void> {
        return this.deleteBoardEntryQuery.execute({
            projectId: params.outerResourceId,
            entryId: params.innerResourceId
        });
    }
}