import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
	// Deletes ALL existing entries
	return knex("comments")
		.del()
		.then(() => {
			// Inserts seed entries
			return knex("comments").insert([
                {
                    id: "15d82b0b-f0c0-4e92-86c2-44ae3cfc046e",
                    body: `How do you plan to control launch velocity?  I know\
                    some highly sophisticated systems have issues with this.`,
                    userId: "stevens-shibboleth_bmcknight22",
                    projectId: "c14dcc7e-ca33-4824-89aa-d8da4d88fecb"
                },
                {
                    id: "41623825-3165-4506-8548-7869afe6af37",
                    body: `Launch speed is controlled via monitored exhaustion\
                    of hydrazine mixed with liquid oxygen.  If too much\
                    hydrazine is consumed too quickly, a choke in the intake\
                    compensates.`,
                    userId: "stevens-shibboleth_kcote2",
                    parentId: "15d82b0b-f0c0-4e92-86c2-44ae3cfc046e",
                    projectId: "c14dcc7e-ca33-4824-89aa-d8da4d88fecb"
                },
                {
                    id: "abc7e15d-a8a4-4982-8b3d-7e3ba751b284",
                    body: `Correction: liquid oxygen is used in a separate\
                    system.  The intake control uses liquid benzene.  The\
                    rest of what @stevens-shibboleth_kcote2 said is correct.`,
                    userId: "stevens-shibboleth_hgrainger5",
                    parentId: "41623825-3165-4506-8548-7869afe6af37",
                    projectId: "c14dcc7e-ca33-4824-89aa-d8da4d88fecb"
                },
                {
                    id: "2f6489c4-4792-4c5e-ae69-d9703bd0928b",
                    body: `Would you be willing to take on Aerospace Engineers?\
                    This project looks awesome!`,
                    userId: "stevens-shibboleth_mgillespie",
                    projectId: "c14dcc7e-ca33-4824-89aa-d8da4d88fecb"
                },
                {
                    id: "f2a44b09-ba40-4366-864b-a6605acc7588",
                    body: `Just read the paper you published on this\
                    @stevens-shibboleth_hgrainger5, the note about\
                    hydroresistors was very clever!`,
                    userId: "stevens-shibboleth_csalas12",
                    projectId: "c14dcc7e-ca33-4824-89aa-d8da4d88fecb"
                }
			]);
		});
}
