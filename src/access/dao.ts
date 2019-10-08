import Project from './models/project';
import knex from 'knex';
import { Project as ProjectSchema } from '../schemas/build/project';
import { SortParams, FilterParams } from '../schemas/build/queryParams';
import { Model, QueryBuilder, ColumnRef } from 'objection';
import { NotFoundError } from '../error/error';

export namespace Access {

    type ProjectQuery = QueryBuilder<Project, Project[], Project[]>;

    type QueryFunction = (query: ProjectQuery, value: any) => any;

    //TODO: can we somehow extend the interface with this?
    interface FilterMapping {
        advisor_id: QueryFunction,
        tag: QueryFunction,
        requested_major: QueryFunction,
        accepting_applications: QueryFunction,
        has_advisor: QueryFunction
    }

    export const mapping: FilterMapping = {
        advisor_id: (query: ProjectQuery, id: string) => {
            return query.joinRelation('advisors').where('userId', id);
        },
        tag: (query: ProjectQuery, value: string) => {
            return query.joinRelation('tags').where('tag', value);
        },
        requested_major: (query: ProjectQuery, value: string) => {
            return query.joinRelation('requestedMajors').where('major', value);
        },
        accepting_applications: (query: ProjectQuery, value: boolean) => {
            return query.where('accepting_applications', true);
        },
        has_advisor: (query: ProjectQuery, value: boolean) => {
            return query.whereExists(query.joinRelation('advisors').where('projectId', 'id'));
        }
    }

    //TODO: find a better way to do this
    function sortOutput(query: ProjectQuery, sorts: SortParams): ProjectQuery {
        if (sorts.sort_by === 'new') {
            return sorts.order ? query.orderBy('created_at', 'desc') : query.orderBy('created_at');
        }
        if (sorts.sort_by === 'popular') {
            query.joinRelation('stars').where('projectId', 'id').count('users.id as popularity');
            return sorts.order ? query.orderBy('popularity', 'desc') : query.orderBy('popularity')
        }
        return query;
    }

    export class Repository {

        constructor(config: knex.Config) {
            Model.knex(knex(config));
        }

        public async getProjectStubs(filters: FilterParams, sorts: SortParams) {
            const query = Project.query();
            for(let param of Object.keys(filters)) {
                mapping[param](query, filters[param]);
            }

            //tack on the sorting parameters
            sortOutput(query, sorts);

            //always chop amount to 25 items
            query.limit(25);

            return await query;
        }

        // allow a NotFoundError to pass back to the client if not found
        public async getProjectDetails(id: string)  {
            return await Project.query().findById(id).throwIfNotFound();
        }

        // * idempotency: if you go to delete and the item is not found,
        // * just return a 200.
        public async createProject(project: ProjectSchema) {
            return await Project.query().insert(project);
        }

        // TODO: should be patching it
        // https://vincit.github.io/objection.js/guide/query-examples.html#update-queries
        public async updateProject(project: ProjectSchema) {
            return await Project.query().update(project);
        }

        // * idempotency: if you go to delete and the item is not found,
        // * just return a 200.
        public async deleteProject(id: string): Promise<void> {
            try {
                await Project.query().deleteById(id).throwIfNotFound();
            } catch (e) {
                if (e instanceof NotFoundError) {
                    return;
                }
            }
        }
    }
}