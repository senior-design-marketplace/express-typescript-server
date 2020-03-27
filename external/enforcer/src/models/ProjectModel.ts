import { Model, Transaction } from "objection";
import { join } from "path";
import { ProjectShared } from "../../../../lib/types/shared/ProjectShared";
import { ApplicationModel } from "./ApplicationModel";
import { BaseModel } from "./BaseModel";
import { BoardItemModel } from "./BoardItemModel";
import { MajorModel } from "./MajorModel";
import { TagModel } from "./TagModel";
import { UserModel } from "./UserModel";
import { Viewable } from "./Viewable";

export class ProjectModel extends BaseModel implements ProjectShared, Viewable {

    static tableName = "projects";
    
    id!: string;
    title!: string;
    tagline!: string;
    acceptingApplications!: boolean;
    createdAt!: Date;
    coverLink!: string;
    thumbnailLink!: string;
    body!: string;

    boardItems!: BoardItemModel[];
    applications!: ApplicationModel[];
    contributors!: UserModel[];
    administrators!: UserModel[]; 
    tags!: TagModel[];
    requestedMajors!: MajorModel[];
    starredBy!: UserModel[];

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
        comments: {
            relation: Model.HasManyRelation,
            modelClass: join(__dirname, "CommentModel"),
            join: {
                from: "projects.id",
                to: "comments.projectId"
            }
        },
        history: {
            relation: Model.HasManyRelation,
            modelClass: join(__dirname, "HistoryEventModel"),
            join: {
                from: "projects.id",
                to: "historyEvents.projectId"
            }
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

    public async getPartialView(transaction?: Transaction): Promise<ProjectShared> {
        return this.$fetchGraph(`[
            tags,
            requestedMajors,
            comments,
            boardItems(mostRecent),
            contributors,
            administrators
        ]`)
    }

    public async getVerboseView(transaction?: Transaction): Promise<ProjectShared> {
        return this.$fetchGraph(`[
            tags,
            requestedMajors,
            comments,
            boardItems(mostRecent),
            contributors,
            administrators,
            applications,
            history
        ]`)
    }

    public async getFullView(transaction?: Transaction): Promise<ProjectShared> {
        return this.getVerboseView(transaction);
    }
}
