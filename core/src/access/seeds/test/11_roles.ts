import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
	// Deletes ALL existing entries
	return knex("rolesValues")
		.del()
		.then(() => {
			// Inserts seed entries
			return knex("rolesValues").insert([
                {
                    value: "CONTRIBUTOR"
                },
                {
                    value: "ADMINISTRATOR"
                },
                {
                    value: "ADVISOR"
                }
			]);
		});
}
