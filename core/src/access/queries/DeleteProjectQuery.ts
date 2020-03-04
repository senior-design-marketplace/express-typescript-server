import ProjectModel from "../models/ProjectModel";

namespace DeleteBoardEntryQuery {

    export type Params = {
        projectId: string;
    }

    export type Result = void;
}

export class DeleteProjectQuery {

    public async execute(params: DeleteBoardEntryQuery.Params): Promise<DeleteBoardEntryQuery.Result> {
        await ProjectModel.query()
            .findById(params.projectId)
            .throwIfNotFound()
            .delete();
    }
}