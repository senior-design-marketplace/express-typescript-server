import { Model } from "objection";

export class ContributorModel extends Model {

	static tableName = "contributors";
    static idColumn = ["projectId", "userId"];

    projectId!: string;
    userId!: string;
}
