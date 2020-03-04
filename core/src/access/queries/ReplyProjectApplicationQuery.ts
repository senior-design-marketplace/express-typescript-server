import { ApplicationMaster } from '../../schemas/types/Application/ApplicationMaster';
import { ResponseType } from '../../schemas/types/Response/ResponseType';
import ApplicationModel from '../models/ApplicationModel';

namespace ReplyProjectApplicationQuery {
    
    export type Params = {
        resourceId: string;
        response: ResponseType
    }

    export type Result = ApplicationMaster;
}

export class ReplyProjectApplicationQuery {

    public async execute(params: ReplyProjectApplicationQuery.Params): Promise<ReplyProjectApplicationQuery.Result> {
        return ApplicationModel.query()
            .patchAndFetchById(params.resourceId, { status: params.response })
            .throwIfNotFound()
            .then((instance) => instance.$toJson() as ApplicationMaster);
    }
}