import { Model } from "objection";

export class AdministratorModel extends Model {

	static tableName = "administrators";
    static idColumn = ["projectId", "userId"];

    projectId!: string;
    userId!: string;
    isAdvisor!: boolean;
}
