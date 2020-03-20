import { Model, Transaction } from "objection";
import { join } from "path";
import { Tag as Bar } from "../../../../lib/types/base/Tag";
import { Tag } from "../types/Tag";
import { Viewable } from "./Viewable";
import { TagShared } from "../../../../lib/types/shared/TagShared";

export default class TagModel extends Model implements TagShared, Viewable<Tag.PartialView, Tag.VerboseView, Tag.FullView> {
    
	static tableName = "tagsValues";

    readonly id!: string;
    readonly value!: Bar;

	static relationMappings = {
		taggedOn: {
			relation: Model.ManyToManyRelation,
			modelClass: join(__dirname, "ProjectModel"),
			join: {
				from: "tagsValues.value",
				through: {
					//tags is the join table
					from: "tags.tag",
					to: "tags.projectId"
				},
				to: "projects.id"
			}
		}
    };
    
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
