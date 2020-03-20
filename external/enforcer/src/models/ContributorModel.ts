import { Model } from "objection";
import { BaseModel } from "./BaseModel";

export class ContributorModel extends BaseModel {

	static tableName = "contributors";
    static idColumn = ["projectId", "userId"];

    projectId!: string;
    userId!: string;
}
