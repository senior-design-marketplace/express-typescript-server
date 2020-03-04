import { Model } from "objection";
import { join } from "path";
import { TagMaster } from "../../schemas/types/Tag/TagMaster";
import { Tag } from "../../schemas/types/Tag/Tag";

export default class TagModel extends Model implements TagMaster {
	static tableName = "tagsValues";

    readonly id!: string;
    readonly value!: Tag;

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
}
