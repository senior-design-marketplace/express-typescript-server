import uuid from "uuid/v4";
import faker from "faker";
import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
	// Deletes ALL existing entries
	return knex("projects")
		.del()
		.then(async () => {
			// Inserts seed entries
			const data = [...Array(10)].map(() => {
				return {
					id: uuid(),
					title: faker.company.companyName(),
                    tagline: faker.company.catchPhrase(),
                    body: faker.lorem.paragraphs(2),
					acceptingApplications: Math.floor(Math.random() * 2),
					createdAt: faker.date.past(10) //up to 10 years ago
				};
			});

			return knex("projects").insert([
				{
					id: "5a4fe8c2-02c7-4596-a4a7-b7788defb8e1",
					title: "The Matrix",
                    tagline: "Be Young, Have Fun, Taste Ooga Booga.",
                    body: faker.lorem.paragraphs(2),
					acceptingApplications: false,
					createdAt: faker.date.past(10)
				},
				{
					id: "25510168-bd7a-446e-b559-38ff9998bdb4",
					title: "Blade Runner",
                    tagline: "Now With 50% More Ooga Booga!",
                    body: faker.lorem.paragraphs(2),
					acceptingApplications: true,
					createdAt: faker.date.past(10)
				},
				{
					id: "aff84430-de88-4c5d-8072-ad1999a01850",
					title: "The Godfather",
                    tagline: "Oh Hungry? Oh Ooga Booga.",
                    body: faker.lorem.paragraphs(2),
					acceptingApplications: false,
					createdAt: faker.date.past(10)
				},
				...data
			]);
		});
}
