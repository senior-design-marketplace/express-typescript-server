import { Model } from "objection";
import { BaseModel } from "./BaseModel";

export class AdministratorModel extends BaseModel {

	static tableName = "administrators";
    static idColumn = ["projectId", "userId"];

    projectId!: string;
    userId!: string;
    isAdvisor!: boolean;
}
