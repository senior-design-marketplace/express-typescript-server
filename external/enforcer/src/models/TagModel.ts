import { Transaction } from "objection";
import { Tag as Bar } from "../../../../lib/types/base/Tag";
import { TagShared } from "../../../../lib/types/shared/TagShared";
import { ViewableModel } from "./ViewableModel";

export class TagModel extends ViewableModel implements TagShared {
    
	static tableName = "tagsValues";

    id!: string;
    value!: Bar;

    public async getPartialView(transaction?: Transaction): Promise<TagModel> {
        return this;
    }
    public async getVerboseView(transaction?: Transaction): Promise<TagModel> {
        return this;
    }
    public async getFullView(transaction?: Transaction): Promise<TagModel> {
        return this;
    }
}
