import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
	// Deletes ALL existing entries
	return knex("applications")
		.del()
		.then(() => {
			// Inserts seed entries
			return knex("applications").insert([
			]);
		});
}
