import { Access } from "../../src/access/dao";
import { FilterParams, SortParams } from "../../src/schemas/build/queryParams/type";
import Config from "../../knexfile";
import Knex from "knex";
import Project from "../../src/access/models/project";

//setup and seed a local database first
const knex: Knex<any, any> = Knex(Config.test);
const repository = new Access.Repository(knex);

beforeAll(async () => {
    await knex.seed.run();
})

// setup to test locally, this takes on a sort of integration test
// style, as we cannot really mock out the access layer
describe("The access layer", () => {
	test("limits queries to 25 values", async () => {
		const filters: FilterParams = {};
		const sorts: SortParams = {};

		const response = await repository.getProjectStubs(filters, sorts);
		expect(response.length).toBe(25);
	});

	test("can filter on having an advisor", async () => {
		const filters: FilterParams = {
			has_advisor: ""
		};
		const sorts: SortParams = {};

		const response = await repository.getProjectStubs(filters, sorts);
		expect(response.length).toBeGreaterThanOrEqual(1);
	});

	test("can sort by new", async () => {
		const filters: FilterParams = {};
		const sorts: SortParams = {
			sort_by: "new"
		};

        const response = await repository.getProjectStubs(filters, sorts);
        const dates = extract(response, "created_at");
		assertOrder(dates, true);
	});

	test("can reverse sorting", async () => {
		const filters: FilterParams = {};
		const sorts: SortParams = {
			sort_by: "new",
			order: "reverse"
		};

		const response = await repository.getProjectStubs(filters, sorts);
		const dates = extract(response, "created_at");
		assertOrder(dates);
	});

	test("can sort on popularity", async () => {
		const filters: FilterParams = {};
		const sorts: SortParams = {
			sort_by: "popular",
			order: "reverse"
		};

		const response = await repository.getProjectStubs(filters, sorts);
		const stars = extract(response, "popularity");
		assertOrder(stars, true);
	});

	test("can handle complex queries", async () => {
		const filters: FilterParams = {
			tag: "Artificial Intelligence",
			accepting_applications: "",
			has_advisor: ""
		};
		const sorts: SortParams = {
			sort_by: "popular",
			order: "reverse"
		};

		const response = await repository.getProjectStubs(filters, sorts);
		expect(response.length).toBeGreaterThanOrEqual(1);
	});

	function extract(data: Project[], field: string): any[] {
		return data.map((project: Project) => {
            const json = project.toJSON();
			return json[field];
		});
	}

	//FIXME: O(n^2) operation.  Please reduce to O(n).
	function assertOrder(data: number[], reverse?: boolean) {
		if (data.length < 2) return;

		if (reverse) expect(data[0]).toBeGreaterThanOrEqual(data[1]);
		else expect(data[0]).toBeLessThanOrEqual(data[1]);

		assertOrder(data.slice(1, data.length), reverse);
	}
});
