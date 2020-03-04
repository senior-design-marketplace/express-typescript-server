import { TagMaster } from "../../schemas/types/Tag/TagMaster";
import TagModel from "../models/TagModel";

namespace DescribeSupportedMajorsQuery {

    export type Result = TagMaster[];
}

export class DescribeSupportedTagsQuery {

    public async execute(): Promise<DescribeSupportedMajorsQuery.Result> {
        return TagModel.query()
            .select('value')
            .then((instances) => {
                return instances.map((instance) => {return instance.$toJson() as TagMaster})
            });
    }
}