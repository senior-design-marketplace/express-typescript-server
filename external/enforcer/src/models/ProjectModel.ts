import { Model, Transaction } from "objection";
import { join } from "path";
import { UserModel } from "./UserModel";
import { BoardItemModel } from "./BoardItemModel";
import { ApplicationModel } from "./ApplicationModel";
import { TagModel } from "./TagModel";
import { MajorModel } from "./MajorModel";
import { Viewable } from "./Viewable";
import { Project } from "../types/Project";
import { ProjectShared } from "../../../../lib/types/shared/ProjectShared";
import { BaseModel } from "./BaseModel";

export class ProjectModel extends BaseModel implements ProjectShared, Viewable<Project.PartialView, Project.VerboseView, Project.FullView> {

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

    public async getPartialView(transaction?: Transaction): Promise<ProjectModel> {
        return this.$fetchGraph(`[
            tags,
            requestedMajors,
            boardItems(mostRecent),
            contributors,
            administrators
        ]`)
    }

    public async getVerboseView(transaction?: Transaction): Promise<ProjectModel> {
        return this.$fetchGraph(`[
            tags,
            requestedMajors,
            boardItems(mostRecent),
            contributors,
            administrators,
            applications
        ]`)
    }

    public async getFullView(transaction?: Transaction): Promise<ProjectModel> {
        return this.getVerboseView(transaction);
    }
}