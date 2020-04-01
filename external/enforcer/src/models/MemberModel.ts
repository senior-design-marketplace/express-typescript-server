import { BaseModel } from "./BaseModel";

export class MemberModel extends BaseModel {

	static tableName = "members";
    static idColumn = ["projectId", "userId"];

    projectId!: string;
    userId!: string;

    contributorId!: string;
    administratorId!: string;
    isAdvisor!: boolean;
}
