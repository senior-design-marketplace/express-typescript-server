import { Model } from "objection";
import { join } from "path";
import { NotFoundError } from "../../error/error";
import { ProjectMaster } from '../../schemas/types/Project/ProjectMaster';
import { MajorMaster } from "../../schemas/types/Major/MajorMaster";
import UserModel from "./UserModel";
import BoardItemModel from "./BoardItemModel";
import ApplicationModel from "./ApplicationModel";
import TagModel from "./TagModel";
import MajorModel from "./MajorModel";

export default class ProjectModel extends Model implements ProjectMaster {
    static tableName = "projects";
    
    static get relatedFindQueryMutates() {
        return false;
    }

	/**
	 * Override to provide our own error that
	 * our handler can pick up
	 */
	static createNotFoundError() {
		return new NotFoundError("Project not found");
    }
    
    readonly id!: string;
    readonly title!: string;
    readonly tagline!: string;
    readonly acceptingApplications!: boolean;
    readonly createdAt!: Date;
    readonly thumbnailLink!: string;
    readonly body!: string;

    // relations should be listed here as well:
    // https://github.com/Vincit/objection.js/issues/559
    readonly boardItems!: BoardItemModel[];
    readonly applications!: ApplicationModel[];
    readonly contributors!: UserModel[];
    readonly administrators!: UserModel[]; 
    readonly tags!: TagModel[];
    readonly requestedMajors!: MajorModel[];
    readonly starredBy!: UserModel[];

	/**
	 * Define how this maps to every other
	 * model.  It is verbose, but it does a
	 * good job of showing what is going on.
	 *
	 * Keep in mind that in a relatedQuery, if
	 * your relation has the same name as a table
	 * that it involves, you will run into a
	 * `table name ${name} specified more than
	 * once` error.
	 */
	static relationMappings = {
        //one-to-many
        boardItems: {
            relation: Model.HasManyRelation,
            modelClass: join(__dirname, "BoardItemModel"),
            join: {
                from: "projects.id",
                to: "boardItems.projectId"
            }
        },
        applications: {
            relation: Model.HasManyRelation,
            modelClass: join(__dirname, "ApplicationModel"),
            join: {
                from: "projects.id",
                to: "applications.projectId"
            },
            extra: [
                'updatedAt',
                'status'
            ]
        },
        //many-to-many
        contributors: {
            relation: Model.ManyToManyRelation,
            modelClass: join(__dirname, "UserModel"),
            join: {
                from: "projects.id",
                through: {
                    //contributors is the join table
                    from: "contributors.projectId",
                    to: "contributors.userId"
                },
                to: "users.id"
            }
        },
        administrators: {
            relation: Model.ManyToManyRelation,
            modelClass: join(__dirname, "UserModel"),
            join: {
                from: "projects.id",
                through: {
                    //administrators is the join table
                    from: "administrators.projectId",
                    to: "administrators.userId",
                    extra: [
                        "isAdvisor"
                    ]
                },
                to: "users.id"
            }
        },
        tags: {
            relation: Model.ManyToManyRelation,
            modelClass: join(__dirname, "TagModel"),
            join: {
                from: "projects.id",
                through: {
                    //tags is the join table
                    from: "tags.projectId",
                    to: "tags.tag"
                },
                to: "tagsValues.value"
            }
        },
        requestedMajors: {
            relation: Model.ManyToManyRelation,
            modelClass: join(__dirname, "MajorModel"),
            join: {
                from: "projects.id",
                through: {
                    //majors is the join table
                    from: "majors.projectId",
                    to: "majors.major"
                },
                to: "majorsValues.value"
            }
        },
        starredBy: {
            relation: Model.ManyToManyRelation,
            modelClass: join(__dirname, "UserModel"),
            join: {
                from: "projects.id",
                through: {
                    //stars is the join table
                    from: "stars.projectId",
                    to: "stars.userId"
                },
                to: "users.id"
            }
        }
    };
}
