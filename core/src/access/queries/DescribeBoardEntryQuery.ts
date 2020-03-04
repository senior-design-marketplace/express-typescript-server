import { BoardEntryMaster } from '../../schemas/types/ProjectBoard/BoardEntryMaster';
import BoardItemModel from "../models/BoardItemModel";

namespace DescribeBoardEntryQuery {

    export type Params = {
        entryId: string;
    }

    export type Result = BoardEntryMaster;
}

export class DescribeBoardEntryQuery {

    public execute(params: DescribeBoardEntryQuery.Params): Promise<DescribeBoardEntryQuery.Result> {
        return BoardItemModel.query()
            .findById(params.entryId)
            .throwIfNotFound()
            .then((instance) => instance.$toJson() as BoardEntryMaster);
    }
}