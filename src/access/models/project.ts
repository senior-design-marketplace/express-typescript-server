import { Model } from 'objection';
import { join } from 'path';
import { NotFoundError } from '../../error/error';

export default class Project extends Model {

    static tableName = 'projects';

    /**
     * Override to provide our own error that
     * our handler can pick up
     */
    static createNotFoundError() {
        return new NotFoundError('Project not found');
    }

    readonly id!: string;
    
    /**
     * Define how this maps to every other
     * model.  It is verbose, but it does a
     * good job of showing what is going on
     */
    static relationMappings = {

        //one-to-many
        boardItems: {
            relation: Model.HasManyRelation,
            modelClass: join(__dirname, 'boardItem'),
            join: {
                from: 'projects.id',
                to: 'boardItems.projectId'
            }
        },
        applications: {
            relation: Model.HasManyRelation,
            modelClass: join(__dirname, 'application'),
            join: {
                from: 'projects.id',
                to: 'applications.projectId'
            }
        },
        requests: {
            relation: Model.HasManyRelation,
            modelClass: join(__dirname, 'requests'),
            join: {
                from: 'projects.id',
                to: 'requests.projectId'
            }
        },

        //many-to-many
        contibutors: {
            relation: Model.ManyToManyRelation,
            modelClass: join(__dirname, 'user'),
            join: {
                from: 'projects.id',
                through: {
                    //contributors is the join table
                    from: 'contributors.projectId',
                    to: 'contributors.userId'
                },
                to: 'users.id'
            }
        },
        administrators: {
            relation: Model.ManyToManyRelation,
            modelClass: join(__dirname, 'user'),
            join: {
                from: 'projects.id',
                through: {
                    //administrators is the join table
                    from: 'administrators.projectId',
                    to: 'administrators.userId'
                },
                to: 'users.id'
            }
        },
        advisors: {
            relation: Model.ManyToManyRelation,
            modelClass: join(__dirname, 'user'),
            join: {
                from: 'projects.id',
                through: {
                    //advisors is the join table
                    from: 'advisors.projectId',
                    to: 'advisors.userId'
                },
                to: 'users.id'
            }
        },
        tags: {
            relation: Model.ManyToManyRelation,
            modelClass: join(__dirname, 'tag'),
            join: {
                from: 'projects.id',
                through: {
                    //tags is the join table
                    from: 'tags.projectId',
                    to: 'tags.tag'
                },
                to: 'tagsValues.value'
            }
        },
        requestedMajors: {
            relation: Model.ManyToManyRelation,
            modelClass: join(__dirname, 'major'),
            join: {
                from: 'projects.id',
                through: {
                    //majors is the join table
                    from: 'majors.projectId',
                    to: 'majors.major'
                },
                to: 'majorsValues.value'
            }
        },
        stars: {
            relation: Model.ManyToManyRelation,
            modelClass: join(__dirname, 'user'),
            join: {
                from: 'projects.id',
                through: {
                    //stars is the join table
                    from: 'stars.projectId',
                    to: 'stars.userId'
                },
                to: 'users.id'
            }
        }
    }
}