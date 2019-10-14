import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
	// Deletes ALL existing entries
	return knex("advisors")
		.del()
		.then(() => {
			// Inserts seed entries
			return knex("advisors").insert([
				{
					projectId: "5a4fe8c2-02c7-4596-a4a7-b7788defb8e1",
					userId: "ac94034b-9c03-4342-aff9-d87ea1666948"
				},
				{
					projectId: "5a4fe8c2-02c7-4596-a4a7-b7788defb8e1",
					userId: "b086c492-434e-419b-80f8-1a8b1539a976"
				},
				{
					projectId: "25510168-bd7a-446e-b559-38ff9998bdb4",
					userId: "b086c492-434e-419b-80f8-1a8b1539a976"
				}
			]);
		});
}
