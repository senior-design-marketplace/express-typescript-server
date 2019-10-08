exports.seed = async function(knex) {
    // Deletes ALL existing entries
    return knex("projects").del()
        .then(() => {
            // Inserts seed entries
            return knex("projects").insert([
                { 
                    id: "5a4fe8c2-02c7-4596-a4a7-b7788defb8e1",
                    title: "The Matrix",
                    tagline: "Be Young, Have Fun, Taste Ooga Booga.",
                    accepting_applications: false
                },
                { 
                    id: "25510168-bd7a-446e-b559-38ff9998bdb4",
                    title: "Blade Runner",
                    tagline: "Now With 50% More Ooga Booga!",
                    accepting_applications: true
                },
                { 
                    id: "aff84430-de88-4c5d-8072-ad1999a01850",
                    title: "The Godfather",
                    tagline: "Oh Hungry? Oh Ooga Booga.",
                    accepting_applications: false
                }
            ]);
        });
};
