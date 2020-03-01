import { Model } from "objection";
import { join } from "path";
import { MajorMaster } from "../../schemas/types/Major/MajorMaster";
import { Major } from "../../schemas/types/Major/Major";

export default class MajorModel extends Model implements MajorMaster {
    static tableName = "majorsValues";
    
    readonly value!: Major;
	readonly id!: string;

	static relationMappings = {
		requestedOn: {
			relation: Model.ManyToManyRelation,
			modelClass: join(__dirname, "ProjectModel"),
			join: {
				from: "majorsValues.value",
				through: {
					//majors is the join table
					from: "majors.major",
					to: "majors.projectId"
				},
				to: "projects.id"
			}
		}
	};
}
