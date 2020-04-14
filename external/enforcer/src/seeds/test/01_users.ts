import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
	// Deletes ALL existing entries
	return knex("users")
		.del()
		.then(() => {
			// Inserts seed entries
			return knex("users").insert([
                {
                    id: "test",
                    firstName: "Koby",
                    lastName: "Lucero",
                    email: "koby.lucero@nowhere",
                    thumbnailLink: "https://marqetplace-staging-photos.s3.amazonaws.com/users/test/avatar",
                    roles: "[member, faculty]"
                },
                {
                    id: "test_1",
                    firstName: "Nayla",
                    lastName: "Stanley",
                    email: "nayla.stanley@nowhere",
                    thumbnailLink: "https://marqetplace-staging-photos.s3.amazonaws.com/users/test_1/avatar",
                    roles: "[member, student]"
                },
                {
                    id: "test_2",
                    firstName: "Tom",
                    lastName: "White",
                    email: "tom.white@nowhere",
                    thumbnailLink: "https://marqetplace-staging-photos.s3.amazonaws.com/users/test_2/avatar",
                    roles: "[member, faculty]"
                },
                {
                    id: "stevens-shibboleth_csalas12",
                    firstName: "Clay",
                    lastName: "Salas",
                    email: "clay.salas@nowhere",
                    bio: "Professor of mechanical engineering @Stevens.  Enjoy long walks on the beach.",
                    thumbnailLink: "https://marqetplace-staging-photos.s3.amazonaws.com/users/stevens-shibboleth_csalas12/avatar",
                    roles: "[member, faculty]"
                },
                {
                    id: "stevens-shibboleth_kcote2",
                    firstName: "Kasim",
                    lastName: "Cote",
                    email: "kasim.cote@nowhere",
                    thumbnailLink: "https://marqetplace-staging-photos.s3.amazonaws.com/users/stevens-shibboleth_kcote2/avatar",
                    roles: "[member, student]"
                },
                {
                    id: "stevens-shibboleth_mdavies6",
                    firstName: "Menachem",
                    lastName: "Davies",
                    email: "menachem.davies@nowhere",
                    thumbnailLink: "https://marqetplace-staging-photos.s3.amazonaws.com/users/stevens-shibboleth_mdavies6/avatar",
                    roles: "[member, student]"
                },
                {
                    id: "stevens-shibboleth_bmcknight22",
                    firstName: "Brooke",
                    lastName: "Mcknight",
                    email: "brooke.mcknight@nowhere",
                    thumbnailLink: "https://marqetplace-staging-photos.s3.amazonaws.com/users/stevens-shibboleth_bmcknight22/avatar",
                    roles: "[member, faculty]"
                },
                {
                    id: "stevens-shibboleth_hgrainger5",
                    firstName: "Harold",
                    lastName: "Grainger",
                    email: "harold.grainger@nowhere",
                    bio: "Systems engineering undergrad at Stevens.  Planning to make the jump to graduate school!",
                    thumbnailLink: "https://marqetplace-staging-photos.s3.amazonaws.com/users/stevens-shibboleth_hgrainger5/avatar",
                    roles: "[member, student]"
                },
                {
                    id: "stevens-shibboleth_sfarrel4",
                    firstName: "Samiyah",
                    lastName: "Farrel",
                    email: "samiyah.farrel@nowhere",
                    thumbnailLink: "https://marqetplace-staging-photos.s3.amazonaws.com/users/stevens-shibboleth_sfarrel4/avatar",
                    roles: "[member, student]"
                },
                {
                    id: "stevens-shibboleth_rmedrano1",
                    firstName: "Rahima",
                    lastName: "Medrano",
                    email: "rahima.medrano@nowhere",
                    thumbnailLink: "https://marqetplace-staging-photos.s3.amazonaws.com/users/stevens-shibboleth_rmedrano1/avatar",
                    roles: "[member, student]"
                },
                {
                    id: "stevens-shibboleth_dwynn14",
                    firstName: "Darcey",
                    lastName: "Wynn",
                    email: "darcey.wynn@nowhere",
                    bio: "4 out of 4 software engineering major.  My cat, Pickles, is a robotics engineer.",
                    thumbnailLink: "https://marqetplace-staging-photos.s3.amazonaws.com/users/stevens-shibboleth_dwynn14/avatar",
                    roles: "[member, student]"
                },
                {
                    id: "stevens-shibboleth_aroberson2",
                    firstName: "April",
                    lastName: "Roberson",
                    email: "april.roberson@nowhere",
                    thumbnailLink: "https://marqetplace-staging-photos.s3.amazonaws.com/users/stevens-shibboleth_aroberson2/avatar",
                    roles: "[member, student]"
                },
                {
                    id: "stevens-shibboleth_mgillespie",
                    firstName: "Morris",
                    lastName: "Gillespie",
                    email: "morris.gillespie@nowhere",
                    thumbnailLink: "https://marqetplace-staging-photos.s3.amazonaws.com/users/stevens-shibboleth_mgillespie/avatar",
                    roles: "[member, student]"
                }
			]);
		});
}
