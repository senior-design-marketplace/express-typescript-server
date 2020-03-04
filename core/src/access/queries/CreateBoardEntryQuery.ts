import BoardItemModel from "../models/BoardItemModel"
import { BoardEntryImmutable } from "../../schemas/types/ProjectBoard/BoardEntryImmutable";
import { BoardEntryMaster } from "../../schemas/types/ProjectBoard/BoardEntryMaster";

namespace CreateBoardEntryQuery {

    export type Params = {
        userId: string;
        projectId: string;
        payload: BoardEntryImmutable
    };

    export type Result = BoardEntryMaster;
}

export class CreateBoardEntryQuery {

    public async execute(params: CreateBoardEntryQuery.Params): Promise<BoardEntryMaster> {
        try {
            await BoardItemModel.query()
                .insert({
                    id: params.payload.id,
                    userId: params.userId,
                    projectId: params.projectId,
                    document: params.payload.document
                });
        } catch (e) {
            // idempotency
        } finally {
            return BoardItemModel.query()
                .findById(params.payload.id)
                .throwIfNotFound()
                .then((instance) => instance.$toJson() as BoardEntryMaster);
        }
    }
}