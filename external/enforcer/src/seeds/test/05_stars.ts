import * as Knex from "knex";
import flatten from "lodash/flatten";

const data = {
    "a427345d-5ef4-45cd-b5aa-cc601daeec73": [
        "stevens-shibboleth_kcote2",
        "stevens-shibboleth_hgrainger5",
        "stevens-shibboleth_mgillespie"
    ],
    "06cf0c70-ff54-45d8-8ad9-1214b93a0431": [
		"stevens-shibboleth_bmcknight22",
		"stevens-shibboleth_hgrainger5",
		"stevens-shibboleth_aroberson2",
    ],
    "0ca8ee3c-29dd-4482-998c-c5c102c5bc92": [
		"stevens-shibboleth_dwynn14",
		"stevens-shibboleth_aroberson2",
		"stevens-shibboleth_mgillespie",
    ],
    "5152a36e-0a71-4353-bac5-7b0a540268a7": [
		"stevens-shibboleth_csalas12",
		"stevens-shibboleth_aroberson2",
		"stevens-shibboleth_mgillespie",
    ],
    "68ccf170-8a98-46c1-b38e-30ba9b7ec259": [
		"stevens-shibboleth_kcote2",
		"stevens-shibboleth_dwynn14",
		"stevens-shibboleth_mgillespie",
    ],
    "c14dcc7e-ca33-4824-89aa-d8da4d88fecb": [
		"stevens-shibboleth_sfarrel4",
		"stevens-shibboleth_csalas12",
    ],
    "90353a1b-8051-4917-b4ed-dc7d89094da4": [
		"stevens-shibboleth_bmcknight22",
		"stevens-shibboleth_mgillespie",
		"stevens-shibboleth_sfarrel4",
    ],
    "45129910-1936-4163-8ae4-d343a80a399d": [
		"stevens-shibboleth_hgrainger5",
		"stevens-shibboleth_dwynn14",
		"stevens-shibboleth_mgillespie",
    ],
    "940fdfd2-6efd-42f6-b612-e742f1e22a79": [
		"stevens-shibboleth_csalas12",
		"stevens-shibboleth_kcote2",
		"stevens-shibboleth_hgrainger5",
    ],
    "addf740c-1e67-4bc2-ad7f-2becdd6286cd": [
		"stevens-shibboleth_rmedrano1",
		"stevens-shibboleth_kcote2",
		"stevens-shibboleth_hgrainger5",
    ],
    "0257ef5f-d0fa-46a5-8307-ade638d479d8": [
		"stevens-shibboleth_rmedrano1",
		"stevens-shibboleth_csalas12",
		"stevens-shibboleth_kcote2",
    ],
    "eef5a8e8-585e-4574-bc59-59d85b591390": [
		"stevens-shibboleth_rmedrano1",
    ],
    "9f81645e-16db-444c-b2fd-49a5ae0a4713": [
		"stevens-shibboleth_hgrainger5",
		"stevens-shibboleth_rmedrano1",
		"stevens-shibboleth_aroberson2",
    ],
    "5287bffc-a669-415f-9832-4211476c3544": [
		"stevens-shibboleth_aroberson2",
		"stevens-shibboleth_bmcknight22",
		"stevens-shibboleth_mdavies6",
    ],
    "f4a80890-6aaf-4848-a4e2-08729d7d4c95": [
		"stevens-shibboleth_rmedrano1",
		"stevens-shibboleth_aroberson2",
		"stevens-shibboleth_bmcknight22",
    ],
    "945285ee-e91c-4c56-8cee-0f21c160163b": [
		"stevens-shibboleth_mdavies6",
		"stevens-shibboleth_bmcknight22",
		"stevens-shibboleth_sfarrel4",
    ]
}

export async function seed(knex: Knex): Promise<any> {
	// Deletes ALL existing entries
	return knex("stars")
		.del()
		.then(() => {
            // Inserts seed entries
            return knex("stars").insert(
                flatten(Object.keys(data).map(project => {
                    return data[project].map((user) => {
                        return {
                            projectId: project,
                            userId: user
                        };
                    });
                }))
            )
		});
}
