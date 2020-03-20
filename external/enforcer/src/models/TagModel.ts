import { Model, Transaction } from "objection";
import { Tag as Bar } from "../../../../lib/types/base/Tag";
import { Tag } from "../types/Tag";
import { Viewable } from "./Viewable";
import { TagShared } from "../../../../lib/types/shared/TagShared";
import { BaseModel } from "./BaseModel";

export class TagModel extends BaseModel implements TagShared, Viewable<Tag.PartialView, Tag.VerboseView, Tag.FullView> {
    
	static tableName = "tagsValues";

    id!: string;
    value!: Bar;

    public async getPartialView(transaction?: Transaction): Promise<Tag.PartialView> {
        return this;
    }
    public async getVerboseView(transaction?: Transaction): Promise<Tag.VerboseView> {
        return this;
    }
    public async getFullView(transaction?: Transaction): Promise<Tag.FullView> {
        return this;
    }
}
