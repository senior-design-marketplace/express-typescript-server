import * as Knex from "knex";
import flatten = require("lodash/flatten");
import { Role } from "../../../../../lib/types/base/Role";

const data: Record<string, { user: string, role: Role, isAdvisor: boolean }[]> = {
    "a427345d-5ef4-45cd-b5aa-cc601daeec73": [
        {
            user: "stevens-shibboleth_csalas12",
            role: "ADMINISTRATOR",
            isAdvisor: true
        },
        {
            user: "stevens-shibboleth_dwynn14",
            role: "ADMINISTRATOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_mdavies6",
            role: "CONTRIBUTOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_hgrainger5",
            role: "CONTRIBUTOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_rmedrano1",
            role: "CONTRIBUTOR",
            isAdvisor: false
        }
    ],
    "06cf0c70-ff54-45d8-8ad9-1214b93a0431": [
        {
            user: "stevens-shibboleth_aroberson2",
            role: "ADMINISTRATOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_kcote2",
            role: "CONTRIBUTOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_hgrainger5",
            role: "CONTRIBUTOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_sfarrel4",
            role: "CONTRIBUTOR",
            isAdvisor: false
        }
    ],
    "0ca8ee3c-29dd-4482-998c-c5c102c5bc92": [
        {
            user: "stevens-shibboleth_dwynn14",
            role: "ADMINISTRATOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_kcote2",
            role: "ADMINISTRATOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_sfarrel4",
            role: "CONTRIBUTOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_rmedrano1",
            role: "CONTRIBUTOR",
            isAdvisor: false
        }
    ],
    "5152a36e-0a71-4353-bac5-7b0a540268a7": [
        {
            user: "stevens-shibboleth_csalas12",
            role: "ADMINISTRATOR",
            isAdvisor: true
        },
        {
            user: "stevens-shibboleth_mdavies6",
            role: "CONTRIBUTOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_mgillespie",
            role: "CONTRIBUTOR",
            isAdvisor: false
        }
    ],
    "68ccf170-8a98-46c1-b38e-30ba9b7ec259": [
        {
            user: "stevens-shibboleth_mdavies6",
            role: "ADMINISTRATOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_hgrainger5",
            role: "CONTRIBUTOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_rmedrano1",
            role: "CONTRIBUTOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_mgillespie",
            role: "CONTRIBUTOR",
            isAdvisor: false
        }
    ],
    "c14dcc7e-ca33-4824-89aa-d8da4d88fecb": [
        {
            user: "stevens-shibboleth_csalas12",
            role: "ADMINISTRATOR",
            isAdvisor: true
        },
        {
            user: "stevens-shibboleth_hgrainger5",
            role: "ADMINISTRATOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_dwynn14",
            role: "CONTRIBUTOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_kcote2",
            role: "CONTRIBUTOR",
            isAdvisor: false
        }
    ],
    "90353a1b-8051-4917-b4ed-dc7d89094da4": [
        {
            user: "stevens-shibboleth_bmcknight22",
            role: "ADMINISTRATOR",
            isAdvisor: true
        },
        {
            user: "stevens-shibboleth_kcote2",
            role: "CONTRIBUTOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_aroberson2",
            role: "CONTRIBUTOR",
            isAdvisor: false
        }
    ],
    "45129910-1936-4163-8ae4-d343a80a399d": [
        {
            user: "stevens-shibboleth_mgillespie",
            role: "ADMINISTRATOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_mdavies6",
            role: "CONTRIBUTOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_hgrainger5",
            role: "CONTRIBUTOR",
            isAdvisor: false
        }
    ],
    "940fdfd2-6efd-42f6-b612-e742f1e22a79": [
        {
            user: "stevens-shibboleth_csalas12",
            role: "ADMINISTRATOR",
            isAdvisor: true
        },
        {
            user: "stevens-shibboleth_bmcknight22",
            role: "ADMINISTRATOR",
            isAdvisor: true
        },
        {
            user: "stevens-shibboleth_rmedrano1",
            role: "ADMINISTRATOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_kcote2",
            role: "CONTRIBUTOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_hgrainger5",
            role: "CONTRIBUTOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_dwynn14",
            role: "CONTRIBUTOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_aroberson2",
            role: "CONTRIBUTOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_mgillespie",
            role: "CONTRIBUTOR",
            isAdvisor: false
        }
    ],
    "addf740c-1e67-4bc2-ad7f-2becdd6286cd": [
        {
            user: "stevens-shibboleth_hgrainger5",
            role: "ADMINISTRATOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_rmedrano1",
            role: "CONTRIBUTOR",
            isAdvisor: false
        }
    ],
    "0257ef5f-d0fa-46a5-8307-ade638d479d8": [
        {
            user: "stevens-shibboleth_kcote2",
            role: "ADMINISTRATOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_mdavies6",
            role: "CONTRIBUTOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_dwynn14",
            role: "CONTRIBUTOR",
            isAdvisor: false
        }
    ],
    "eef5a8e8-585e-4574-bc59-59d85b591390": [
        {
            user: "stevens-shibboleth_bmcknight22",
            role: "ADMINISTRATOR",
            isAdvisor: true
        },
        {
            user: "stevens-shibboleth_sfarrel4",
            role: "CONTRIBUTOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_mgillespie",
            role: "CONTRIBUTOR",
            isAdvisor: false
        }
    ],
    "9f81645e-16db-444c-b2fd-49a5ae0a4713": [
        {
            user: "stevens-shibboleth_hgrainger5",
            role: "ADMINISTRATOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_kcote2",
            role: "CONTRIBUTOR",
            isAdvisor: false
        }
    ],
    "5287bffc-a669-415f-9832-4211476c3544": [
        {
            user: "stevens-shibboleth_csalas12",
            role: "ADMINISTRATOR",
            isAdvisor: true
        },
        {
            user: "stevens-shibboleth_kcote2",
            role: "ADMINISTRATOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_rmedrano1",
            role: "CONTRIBUTOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_mgillespie",
            role: "CONTRIBUTOR",
            isAdvisor: false
        }
    ],
    "f4a80890-6aaf-4848-a4e2-08729d7d4c95": [
        {
            user: "stevens-shibboleth_bmcknight22",
            role: "ADMINISTRATOR",
            isAdvisor: true
        },
        {
            user: "stevens-shibboleth_dwynn14",
            role: "CONTRIBUTOR",
            isAdvisor: false
        }
    ],
    "945285ee-e91c-4c56-8cee-0f21c160163b": [
        {
            user: "stevens-shibboleth_csalas12",
            role: "ADMINISTRATOR",
            isAdvisor: true
        },
        {
            user: "stevens-shibboleth_mdavies6",
            role: "CONTRIBUTOR",
            isAdvisor: false
        },
        {
            user: "stevens-shibboleth_aroberson2",
            role: "CONTRIBUTOR",
            isAdvisor: false
        }
    ]
}

export async function seed(knex: Knex): Promise<any> {
	// Deletes ALL existing entries
	return knex("members")
		.del()
		.then(() => {
			// Inserts seed entries
			return knex("members").insert(
                flatten(Object.keys(data).map(key => {
                    return data[key].map(membership => {
                        const obj = {
                            projectId: key,
                            userId: membership.user,
                            isAdvisor: membership.isAdvisor
                        }

                        switch (membership.role) {
                            case "CONTRIBUTOR":
                                return {
                                    contributorId: membership.user,
                                    ...obj
                                }
                            case "ADMINISTRATOR":
                                return {
                                    administratorId: membership.user,
                                    ...obj
                                }
                        }
                    })
                })
			));
		})
}
