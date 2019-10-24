import Project from "./models/project";
import Knex from "knex";
import { ProjectMaster as ProjectSchema } from "../schemas/build/project/projectMaster/type";
import { SortParams, FilterParams } from "../schemas/build/queryParams/type";
import { Model, QueryBuilder } from "objection";
import { NotFoundError } from "../error/error";
import * as constants from "./constants.json";

export namespace Access {
	type ProjectQuery = QueryBuilder<Project, Project[], Project[]>;

	const columns = constants.tables.projects.columns;

	const filtering = {
		advisor_id: (query: ProjectQuery, id: string) => {
			return query.joinRelation("advisors").where("userId", id);
		},
		tag: (query: ProjectQuery, tag: string) => {
			return query.joinRelation("tags").where("tag", tag);
		},
		requested_major: (query: ProjectQuery, major: string) => {
			return query.joinRelation("requestedMajors").where("major", major);
		},
		accepting_applications: (query: ProjectQuery, _: string) => {
			return query.where(columns.acceptingApplications, true);
		},
		has_advisor: (query: ProjectQuery, _: string) => {
			//must be distinct to avoid duplicating projects with multiple advisors
			return query.joinRelation("advisors").distinct("projects.*");
		}
	};

	const sorting = {
		new: (query: ProjectQuery, order: string | undefined) => {
			return addOrdering(query, columns.createdAt, order);
		},
		popular: (query: ProjectQuery, order: string | undefined) => {
			query.select([
				"projects.*",
				Project.relatedQuery("starredBy")
					.count()
					.as("popularity")
			]);
			return addOrdering(query, "popularity", order);
		}
	};

	function addOrdering(
		query: ProjectQuery,
		column: string,
		order: string | undefined
	): ProjectQuery {
		if (order) return query.orderBy(column);
		else return query.orderBy(column, "desc");
	}

	export class Repository {
		constructor(knex: Knex<any, unknown[]>) {
			Model.knex(knex);
		}

		public async getProjectStubs(filters: FilterParams, sorts: SortParams) {
			const query = Project.query();
			for (let filter of Object.keys(filters)) {
				if (filters[filter] || filters[filter] === "") {
					//allow empty strings to pass through
					filtering[filter](query, filters[filter]);
				}
			}

			// tack on the sorting parameters
			const { order, sort_by } = sorts;
			if (sort_by) {
				sorting[sort_by](query, order);
			}

			//always chop amount to 25 items
			return await query.limit(25);
		}

		// allow a NotFoundError to pass back to the client if not found
		public async getProjectDetails(id: string) {
			return await Project.query()
				.findById(id)
				.throwIfNotFound();
		}

		// * idempotency: if you go to delete and the item is not found,
		// * just return a 200.
		public async createProject(project: ProjectSchema) {
			return await Project.query().insert(project);
		}

		// * idempotency: go ahead and just reprocess it.  If it is the
		// * same request, it will not alter the object.
		public async updateProject(project: ProjectSchema) {
			return await Project.query().patch(project);
		}

		// * idempotency: if you go to delete and the item is not found,
		// * just return a 200.
		public async deleteProject(id: string) {
			try {
				await Project.query()
					.deleteById(id)
					.throwIfNotFound();
			} catch (e) {
				if (e instanceof NotFoundError) {
					return;
				}
			}
		}
	}
}
