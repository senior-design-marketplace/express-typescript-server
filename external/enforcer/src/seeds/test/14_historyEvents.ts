import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
	// Deletes ALL existing entries
	return knex("historyEvents")
		.del();
}
