import { Model, Transaction } from "objection";
import { join } from "path";
import { Major as Foo } from "../../../../lib/types/base/Major";
import { MajorShared } from "../../../../lib/types/shared/MajorShared";
import { BaseModel } from "./BaseModel";
import { Viewable } from "./Viewable";

export class MajorModel extends BaseModel implements MajorShared, Viewable{
    
    static tableName = "majorsValues";
    
    readonly value!: Foo;
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

    public async getPartialView(transaction?: Transaction): Promise<MajorShared> {
        return this;
    }

    public async getVerboseView(transaction?: Transaction): Promise<MajorShared> {
        return this;
    }
    
    public async getFullView(transaction?: Transaction): Promise<MajorShared> {
        return this;
    }
}
