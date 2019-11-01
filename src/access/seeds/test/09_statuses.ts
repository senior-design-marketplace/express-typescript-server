import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
	// Deletes ALL existing entries
	return knex("statuses")
		.del()
		.then(() => {
			// Inserts seed entries
			return knex("statuses").insert([
                {
                    value: "PENDING"
                },
                {
                    value: "ACCEPTED"
                },
                {
                    value: "DENIED"
                }
			]);
		});
}
