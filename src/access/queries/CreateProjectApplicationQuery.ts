import { ApplicationImmutable } from '../../schemas/types/Application/ApplicationImmutable';
import { ApplicationMaster } from '../../schemas/types/Application/ApplicationMaster';
import ApplicationModel from '../models/ApplicationModel';

namespace CreateProjectApplicationQuery {

    export type Params = {
        userId: string;
        projectId: string;
        payload: ApplicationImmutable;
    }

    export type Result = ApplicationMaster;
}

export class CreateProjectApplicationQuery {

    public async execute(params: CreateProjectApplicationQuery.Params): Promise<CreateProjectApplicationQuery.Result> {
        try {
            await ApplicationModel.query()
                .insert({
                    userId: params.userId,
                    projectId: params.projectId,
                    id: params.payload.id,
                    status: "PENDING"
                })
        } catch (e) {
            // idempotency
        } finally {
            return ApplicationModel.query()
                .findById(params.payload.id)
                .throwIfNotFound()
                .then((instance) => instance.$toJson() as ApplicationMaster)
        }
    }
}
