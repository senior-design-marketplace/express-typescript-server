import BoardItemModel from "../models/BoardItemModel"
import { BoardEntryImmutable } from "../../schemas/types/ProjectBoard/BoardEntryImmutable";
import { BoardEntryMaster } from "../../schemas/types/ProjectBoard/BoardEntryMaster";

namespace CreateBoardEntryQuery {

    export type Params = BoardEntryImmutable;

    export type Result = BoardEntryMaster;
}

export class CreateBoardEntryQuery {

    public async execute(payload: BoardEntryImmutable): Promise<BoardEntryMaster> {
        try {
            await BoardItemModel.query()
                .insert(payload)
        } catch (e) {
            // idempotency
        } finally {
            return BoardItemModel.query()
                .findById(payload.entryId)
                .then((instance) => instance.$toJson() as BoardEntryMaster);
        }
    }
}