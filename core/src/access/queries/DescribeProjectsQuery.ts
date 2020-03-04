import { OrderByDirection, QueryBuilder, ref } from "objection";
import { ProjectMaster } from "../../schemas/types/Project/ProjectMaster";
import { FilterParams } from "../../schemas/types/QueryParams/FilterParams";
import { Sort, SortParams } from "../../schemas/types/QueryParams/SortParams";
import ProjectModel from "../models/ProjectModel";

namespace DescribeProjectsQuery {

    export type Params = {
        sortParams: SortParams;
        filterParams: FilterParams;
        page?: number
    }

    export type Result = ProjectMaster[];
}

type ProjectQuery = QueryBuilder<ProjectModel, ProjectModel[]>;
type FilterFunction = (query: ProjectQuery, param: string | boolean) => ProjectQuery;

const filterFunctions: Record<keyof FilterParams, FilterFunction> = {
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
const sortFunctions: Partial<Record<Sort, SortFunction>> = {
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

export class DescribeProjectsQuery {

    public async execute(params: DescribeProjectsQuery.Params): Promise<DescribeProjectsQuery.Result> {
        const query = ProjectModel.query();

        const { filterParams, sortParams } = params;
        for (const key of Object.keys(filterParams)) {
            filterFunctions[key](query, filterParams[key]);
        }

        if (sortParams.sortBy) {
            const direction = sortParams.order === 'reverse' ? 'asc' : 'desc';
            sortFunctions[sortParams.sortBy]!(query, direction)
        }

        return query.limit(25)
            .then((instances) => {
                return instances.map((instance) => instance.$toJson()) as ProjectMaster[]
            })
    }
}