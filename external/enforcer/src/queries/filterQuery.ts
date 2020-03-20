import { OrderByDirection, QueryBuilder } from "objection";
import { ProjectShared } from "../../../../lib/types/shared/ProjectShared";
import ProjectModel from "../models/ProjectModel";
import { Project } from "../types/Project";

type ProjectQuery = QueryBuilder<ProjectModel, ProjectModel[]>;
type FilterFunction = (query: ProjectQuery, param: string | boolean) => ProjectQuery;

const filterFunctions: Record<string, FilterFunction> = {
    tag: (query: ProjectQuery, param: string | boolean) => {
        return query.joinRelated('tags')
            .where("tag", param);
    },
    advisorId: (query: ProjectQuery, param: string | boolean) => {
        return query.joinRelated('administrators')
            .where('isAdvisor', true)
            .andWhere('userId', param)
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
    }
}

type SortFunction = (query: ProjectQuery, order: OrderByDirection) =>  ProjectQuery;
const sortFunctions: Partial<Record<string, SortFunction>> = {
    new: (query: ProjectQuery, order: OrderByDirection | undefined) => {
        return query.orderBy([{ column: 'createdAt', order }])
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

export default function execute(params: Project.QueryParams): Promise<ProjectShared[]> {
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

    return query.limit(25);
}