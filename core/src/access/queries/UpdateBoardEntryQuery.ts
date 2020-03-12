import { BoardEntryMaster } from "../../schemas/types/ProjectBoard/BoardEntryMaster";
import { BoardEntryMutable } from "../../schemas/types/ProjectBoard/BoardEntryMutable";
import BoardItemModel from "../models/BoardItemModel";

namespace UpdateBoardEntryQuery {

    export type Params = {
        outerResourceId: string;
        innerResourceId: string;
        payload: BoardEntryMutable;
    }

    export type Result = BoardEntryMaster
}

export class UpdateBoardEntryQuery {

    public async execute(params: UpdateBoardEntryQuery.Params): Promise<UpdateBoardEntryQuery.Result> {
        return BoardItemModel.query()
            .patchAndFetchById(params.innerResourceId, params.payload)
            .throwIfNotFound()
            .then((instance) => instance.$toJson() as BoardEntryMaster);
    }
}