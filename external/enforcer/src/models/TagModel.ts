import { Transaction } from "objection";
import { Tag as Bar } from "../../../../lib/types/base/Tag";
import { TagShared } from "../../../../lib/types/shared/TagShared";
import { BaseModel } from "./BaseModel";
import { Viewable } from "./Viewable";

export class TagModel extends BaseModel implements TagShared, Viewable {
    
	static tableName = "tagsValues";

    id!: string;
    value!: Bar;

    public async getPartialView(transaction?: Transaction): Promise<TagShared> {
        return this;
    }
    public async getVerboseView(transaction?: Transaction): Promise<TagShared> {
        return this;
    }
    public async getFullView(transaction?: Transaction): Promise<TagShared> {
        return this;
    }
}
