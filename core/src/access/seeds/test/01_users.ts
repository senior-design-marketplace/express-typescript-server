import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
	// Deletes ALL existing entries
	return knex("users")
		.del()
		.then(() => {
			// Inserts seed entries
			return knex("users").insert([
				{
					id: "b086c492-434e-419b-80f8-1a8b1539a976",
				},
				{
					id: "ac94034b-9c03-4342-aff9-d87ea1666948",
				},
				{
					id: "005cbaec-13e0-40fc-920e-bc2f5a65a74e",
                },
                {
                    id: "test",
                },
                {
                    id: "test_1",
                }
			]);
		});
}
