const uuid = require('uuid/v4');
const faker = require('faker');

exports.seed = async function(knex) {
    // Deletes ALL existing entries
    return knex("projects").del()
        .then(async () => {
            // Inserts seed entries
            const data = [...Array(50)].map(() => {
                return {
                    id: uuid(),
                    title: faker.company.companyName(),
                    tagline: faker.company.catchPhrase(),
                    accepting_applications: Math.floor(Math.random() * 2),
                    created_at: faker.date.past(10) //up to 10 years ago
                }
            });

            return knex("projects").insert([
                { 
                    id: "5a4fe8c2-02c7-4596-a4a7-b7788defb8e1",
                    title: "The Matrix",
                    tagline: "Be Young, Have Fun, Taste Ooga Booga.",
                    accepting_applications: false,
                    created_at: faker.date.past(10)
                },
                { 
                    id: "25510168-bd7a-446e-b559-38ff9998bdb4",
                    title: "Blade Runner",
                    tagline: "Now With 50% More Ooga Booga!",
                    accepting_applications: true,
                    created_at: faker.date.past(10)
                },
                { 
                    id: "aff84430-de88-4c5d-8072-ad1999a01850",
                    title: "The Godfather",
                    tagline: "Oh Hungry? Oh Ooga Booga.",
                    accepting_applications: false,
                    created_at: faker.date.past(10)
                },
                ...data
            ]);
        });
};
