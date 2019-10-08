import Project from './models/project';
import { Project as ProjectSchema } from '../schemas/build/project';
import { QueryParams, FilterParams } from '../schemas/build/queryParams';
import { Model, QueryBuilder } from 'objection';
import knex from 'knex';
import * as config from './env.json';

Model.knex(knex(config));

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

    //TODO: can we somehow extend the interface with this?
    export const filterMapping: FilterMapping = {
        //provide the projects for this advisor
        advisor_id: (query: ProjectQuery, id: string) => {
            return query.joinRelation('advisors').where('userId', id);
        },
        //provide the projets with this tag
        tag: (query: ProjectQuery, value: string) => {
            return query.joinRelation('tags').where('tag', value);
        },
        //provide the projects requesting this major
        requested_major: (query: ProjectQuery, value: string) => {
            return query.joinRelation('requestedMajors').where('major', value);
        },
        //provide projects accepting applications
        accepting_applications: (query: ProjectQuery, value: boolean) => {
            return query.where('accepting_applications', true);
        },
        //provide projects that have an advisor
        has_advisor: (query: ProjectQuery, value: boolean) => {
            return query.whereExists(query.joinRelation('advisors').where('projectId', 'id'));
        }
    }

    export class Repository {

        public async getProjectStubs(params: FilterParams) {
            const query = Project.query();
            for(let param of Object.keys(params)) {
                filterMapping[param](query, params[param]);
            }

            return await query;
        }

        public async getProjectDetails(id: string)  {
            return await Project.query().findById(id);
        }

        public async createProject(project: ProjectSchema) {
            return await Project.query().insert(project);
        }

        // TODO: should be patching it
        // https://vincit.github.io/objection.js/guide/query-examples.html#update-queries
        public async updateProject(project: ProjectSchema) {
            return await Project.query().update(project);
        }

        public async deleteProject(id: string) {
            return await Project.query().deleteById(id);
        }
    }
}