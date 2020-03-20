import { Model, Transaction } from "objection";
import { join } from "path";
import { Major as Foo } from "../../../../lib/types/base/Major";
import { Viewable } from "./Viewable";
import { Major } from "../types/Major";
import { MajorShared } from "../../../../lib/types/shared/MajorShared";

export class MajorModel extends Model implements MajorShared, Viewable<Major.PartialView, Major.VerboseView, Major.FullView>{
    
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

    public async getPartialView(transaction?: Transaction): Promise<Major.PartialView> {
        return this;
    }

    public async getVerboseView(transaction?: Transaction): Promise<Major.VerboseView> {
        return this;
    }
    
    public async getFullView(transaction?: Transaction): Promise<Major.FullView> {
        return this;
    }
}
