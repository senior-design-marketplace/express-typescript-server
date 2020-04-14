import * as Knex from "knex";
import { majorList, Major } from "../../../../../lib/types/base/Major";
import { tagList, Tag } from "../../../../../lib/types/base/Tag";
import flatten = require("lodash/flatten");

const data: Record<string, (Tag | Major)[]> = {
    "a427345d-5ef4-45cd-b5aa-cc601daeec73": [
        "Biomedical",
        "Deep Learning"
    ],
    "06cf0c70-ff54-45d8-8ad9-1214b93a0431": [
        "Construction",
        "Strategic Thinking"
    ],
    "0ca8ee3c-29dd-4482-998c-c5c102c5bc92": [
        "Social Skills",
        "Situational Learning"
    ],
    "68ccf170-8a98-46c1-b38e-30ba9b7ec259": [
        "Sports",
        "Money Management"
    ],
    "c14dcc7e-ca33-4824-89aa-d8da4d88fecb": [
        "Rocketry",
        "Energy"
    ],
    "90353a1b-8051-4917-b4ed-dc7d89094da4": [
        "Health Care"
    ],
    "45129910-1936-4163-8ae4-d343a80a399d": [
        "Petroleum Engineering"
    ],
    "940fdfd2-6efd-42f6-b612-e742f1e22a79": [
        "Naval Engineering",
        "Boating"
    ],
    "addf740c-1e67-4bc2-ad7f-2becdd6286cd": [
        "Acoustics"
    ],
    "0257ef5f-d0fa-46a5-8307-ade638d479d8": [
        "Public Works",
        "Construction"
    ],
    "eef5a8e8-585e-4574-bc59-59d85b591390": [
        "Project Management",
        "Leadership"
    ],
    "9f81645e-16db-444c-b2fd-49a5ae0a4713": [
        "Banking",
        "Finance"
    ],
    "5287bffc-a669-415f-9832-4211476c3544": [
        "Artificial Intelligence",
        "Automation"
    ],
    "f4a80890-6aaf-4848-a4e2-08729d7d4c95": [
        "Astronomy",
        "Circuitry"
    ],
    "945285ee-e91c-4c56-8cee-0f21c160163b": [
        "Biology"
    ]
}

export async function seed(knex: Knex): Promise<any> {
	// Deletes ALL existing entries
	return knex("tagsValues")
		.del()
		.then(() => {
			// Inserts seed entries
			return knex("tagsValues").insert([
                ...tagList.map(tag => {
                    return { value: tag }
                }),
                ...majorList.map(major => {
                    return { value: major }
                })
            ]);
		})
		.then(() => {
			return knex("tags").del();
		})
		.then(() => {
			return knex("tags").insert(
                flatten(Object.keys(data).map(project => {
                    return data[project].map((tag) => {
                        return {
                            projectId: project,
                            tag: tag
                        };
                    });
                }))
            );
		});
}
