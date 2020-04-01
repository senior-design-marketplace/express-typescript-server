import { Model, Transaction } from "objection";
import { join } from "path";
import { ProjectShared } from "../../../../lib/types/shared/ProjectShared";
import { ApplicationModel } from "./ApplicationModel";
import { BoardItemModel } from "./BoardItemModel";
import { MajorModel } from "./MajorModel";
import { TagModel } from "./TagModel";
import { UserModel } from "./UserModel";
import { ViewableModel } from "./ViewableModel";

export class ProjectModel extends ViewableModel implements ProjectShared {

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
    members!: UserModel[];
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
        members: {
            relation: Model.ManyToManyRelation,
            modelClass: join(__dirname, "UserModel"),
            join: {
                from: "projects.id",
                through: {
                    from: "members.projectId",
                    to: "members.userId"
                },
                to: "users.id"
            }
        },
        contributors: {
            relation: Model.ManyToManyRelation,
            modelClass: join(__dirname, "UserModel"),
            join: {
                from: "projects.id",
                through: {
                    from: "members.projectId",
                    to: "members.contributorId"
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
                    from: "members.projectId",
                    to: "members.administratorId"
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

    public async getPartialView(transaction?: Transaction): Promise<ProjectModel> {
        return this.$fetchGraph(`[
            tags,
            requestedMajors,
            comments,
            boardItems(mostRecent),
            contributors,
            administrators
        ]`)
    }

    public async getVerboseView(transaction?: Transaction): Promise<ProjectModel> {
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

    public async getFullView(transaction?: Transaction): Promise<ProjectModel> {
        return this.getVerboseView(transaction);
    }
}
