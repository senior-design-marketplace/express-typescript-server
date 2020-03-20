import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
	// Deletes ALL existing entries
	return knex("majorsValues")
		.del()
		.then(() => {
			// Inserts seed entries
			return knex("majorsValues").insert([
				{ value: "Computer Science" },
				{ value: "Software Engineering" },
				{ value: "Computer Engineering" }
			]);
		})
		.then(() => {
			return knex("majors").del();
		})
		.then(() => {
			return knex("majors").insert([
				{
					projectId: "5a4fe8c2-02c7-4596-a4a7-b7788defb8e1",
					major: "Computer Science"
				},
				{
					projectId: "5a4fe8c2-02c7-4596-a4a7-b7788defb8e1",
					major: "Software Engineering"
				},
				{
					projectId: "25510168-bd7a-446e-b559-38ff9998bdb4",
					major: "Computer Science"
				}
			]);
		});
}
