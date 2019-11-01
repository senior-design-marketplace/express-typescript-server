import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
	// Deletes ALL existing entries
	return knex("applications")
		.del()
		.then(() => {
			// Inserts seed entries
			return knex("applications").insert([
                {
                    id: "bef191e1-389c-4461-98f7-e01fbc7937fa",
                    updatedAt: "2019-10-31T22:54:26+0000",
                    projectId: "5a4fe8c2-02c7-4596-a4a7-b7788defb8e1",
                    userId: "005cbaec-13e0-40fc-920e-bc2f5a65a74e",
                    status: "DENIED"
                },
                {
                    id: "aad222f2-406d-43de-aa59-ff507f6973ae",
                    updatedAt: "2019-10-31T22:54:41+0000",
                    projectId: "5a4fe8c2-02c7-4596-a4a7-b7788defb8e1",
                    userId: "005cbaec-13e0-40fc-920e-bc2f5a65a74e",
                    status: "PENDING"
                }
			]);
		});
}
