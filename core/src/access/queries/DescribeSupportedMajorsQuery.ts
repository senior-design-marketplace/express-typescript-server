import { MajorMaster } from "../../schemas/types/Major/MajorMaster";
import MajorModel from "../models/MajorModel";

namespace DescribeSupportedMajorsQuery {

    export type Result = MajorMaster[];
}

export class DescribeSupportedMajorsQuery {

    public async execute(): Promise<DescribeSupportedMajorsQuery.Result> {
        return MajorModel.query()
            .select('value')
            .then((instances) => {
                return instances.map((instance) => {return instance.$toJson() as MajorMaster})
            });
    }
}