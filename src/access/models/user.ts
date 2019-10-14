import { Model } from "objection";
import { join } from "path";

export default class User extends Model {
	static tableName = "users";

	readonly id!: string;

	//TODO: Properties of a user will depend
	//on the attributes we receive from
	//Stevens single-sign-on

	static relationMapping = {
		//one-to-many
		requests: {
			relation: Model.HasManyRelation,
			modelClass: join(__dirname, "request"),
			join: {
				from: "users.id",
				to: "requests.userId"
			}
		},
		applications: {
			relation: Model.HasManyRelation,
			modelClass: join(__dirname, "application"),
			join: {
				from: "users.id",
				to: "applications.userId"
			}
		},

		//many-to-many
		stars: {
			relation: Model.ManyToManyRelation,
			modelClass: join(__dirname, "user"),
			join: {
				from: "users.id",
				through: {
					from: "stars.userId",
					to: "stars.projectId"
				},
				to: "projects.id"
			}
		},
		contributorOn: {
			relation: Model.ManyToManyRelation,
			modelClass: join(__dirname, "project"),
			join: {
				from: "users.id",
				through: {
					from: "contributors.userId",
					to: "contributors.projectId"
				},
				to: "projects.id"
			}
		},
		administratorOn: {
			relation: Model.ManyToManyRelation,
			modelClass: join(__dirname, "project"),
			join: {
				from: "users.id",
				through: {
					from: "administrators.userId",
					to: "administrators.projectId"
				},
				to: "projects.id"
			}
		},
		advisorOn: {
			relation: Model.ManyToManyRelation,
			modelClass: join(__dirname, "project"),
			join: {
				from: "users.id",
				through: {
					from: "advisors.userId",
					to: "advisors.projectId"
				},
				to: "projects.id"
			}
		}
	};
}
