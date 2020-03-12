import BoardItemModel from "../models/BoardItemModel"

namespace DeleteBoardEntryQuery {

    export type Params = {
        projectId: string;
        entryId: string;
    }

    export type Result = void;
}

export class DeleteBoardEntryQuery {

    public async execute(params: DeleteBoardEntryQuery.Params): Promise<DeleteBoardEntryQuery.Result> {
        await BoardItemModel.query()
            .findById(params.entryId)
            .throwIfNotFound()
            .delete();
    }
}