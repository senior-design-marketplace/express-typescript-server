import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
	// Deletes ALL existing entries
	return knex("tagsValues")
		.del()
		.then(() => {
			// Inserts seed entries
			return knex("tagsValues").insert([
				{ value: "Artificial Intelligence" },
				{ value: "Programming" },
				{ value: "Machine Learning" }
			]);
		})
		.then(() => {
			return knex("tags").del();
		})
		.then(() => {
			return knex("tags").insert([
				{
					projectId: "5a4fe8c2-02c7-4596-a4a7-b7788defb8e1",
					tag: "Artificial Intelligence"
				},
				{
					projectId: "5a4fe8c2-02c7-4596-a4a7-b7788defb8e1",
					tag: "Programming"
				},
				{
					projectId: "25510168-bd7a-446e-b559-38ff9998bdb4",
					tag: "Artificial Intelligence"
				}
			]);
		});
}
