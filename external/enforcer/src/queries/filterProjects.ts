import { OrderByDirection, QueryBuilder } from "objection";
import { ProjectModel } from "../models/ProjectModel";
import { Project } from "../types/Project";

type ProjectQuery = QueryBuilder<ProjectModel, ProjectModel[]>;
type FilterFunction = (query: ProjectQuery, param: string | boolean) => ProjectQuery;

const filterFunctions: Record<string, FilterFunction> = {
    tag: (query: ProjectQuery, param: string | boolean) => {
        return query.joinRelated('tags')
            .where("tag", param);
    },
    advisor: (query: ProjectQuery, param: string | boolean) => {
        return query.joinRelated('administrators')
            .where('isAdvisor', true)
            .andWhere('lastName', 'like', `%${param}%`) // see SQL pattern matching
    },
    hasAdvisor: (query: ProjectQuery, param: string | boolean) => {
        if (param) {
            return query.whereIn(
                'projects.id',
                ProjectModel.query().select('projects.id')
                    .joinRelated('administrators')
                    .where('isAdvisor', true)
            )
        } else {
            return query.whereNotIn(
                'projects.id',
                ProjectModel.query().select('projects.id')
                    .joinRelated('administrators')
                    .where('isAdvisor', true)
            )
        }
    },
    requestedMajor: (query: ProjectQuery, param: string | boolean) => {
        return query.joinRelated('requestedMajors')
            .where('major', param);
    },
    acceptingApplications: (query: ProjectQuery, param: string | boolean) => {
        return query.where('acceptingApplications', param);
    },
    title: (query: ProjectQuery, param: string | boolean) => {
        return query.where('title', 'like', `%${param}%`);
    }
}

type SortFunction = (query: ProjectQuery, order: OrderByDirection) => ProjectQuery;
const sortFunctions: Partial<Record<string, SortFunction>> = {
    new: (query: ProjectQuery, order: OrderByDirection | undefined) => {
        return query.orderBy('createdAt', order);
    },
    popular: (query: ProjectQuery, order: OrderByDirection | undefined) => {
        return query.select([
            'projects.*',
            ProjectModel.relatedQuery('starredBy')
                .count()
                .as('popularity')
        ])
        .orderBy('popularity', order);
    }
}

export async function filterProjects(params: Project.QueryParams = {}): Promise<ProjectModel[]> {
    const query = ProjectModel.query();

    for (const key of Object.keys(params)) {
        const filter = filterFunctions[key];

        if (filter) {
            filter(query, params[key]);
        }
    }

    const sort = params.sortBy;
    if (sort) {
        const func = sortFunctions[sort];

        if (func) {
            const direction = params.order === 'reverse' ? 'asc' : 'desc';
            func(query, direction);
        }
    }

    const page = params.page || 0;
    const perPage = params.perPage || 24;

    return (await query.page(page, Math.min(perPage, 24))).results;
}