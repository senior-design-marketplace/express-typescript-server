import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
	// Deletes ALL existing entries
	return knex("boardItems")
		.del()
		.then(() => {
			// Inserts seed entries
			return knex("boardItems").insert([
                {
                    id: "400dfcc6-b28a-4f76-8909-d0490c4bbc6d",
                    document: {
                        type: "TEXT",
                        body: `We are pleased to announce the formal launch of\
                        the CAP3 project!  Under the advisory of\
                        @stevens-shibboleth_csalas12, we plan to take this\
                        project into orbit!  Through advanced polymerization\
                        of various chemical compounds, we plan to boost intake\
                        efficiency in rockets.
                        
                        Our studies at this stage seem to indicate that\
                        improvements in launch efficiency may jump by as much\
                        as 56%.  This would represent a staggering increase\
                        over modern technology.
                        
                        Also applications are currently open.  Please see the\
                        project description for requested majors.`
                    },
                    createdAt: "2020-03-12 16:42:51.000000-04",
                    projectId: "c14dcc7e-ca33-4824-89aa-d8da4d88fecb",
                    userId: "stevens-shibboleth_hgrainger5",
                },
                {
                    id: "c6c5e88b-bea8-4fe0-94f1-99ba259965d3",
                    document: {
                        type: "TEXT",
                        body: `It appears that a new form of Aluminum has been\
                        discovered in a laboratory environment!  Through\
                        extreme amounts of magnetism, our very own\
                        @stevens-shibboleth_csalas12 was able to produce a\
                        stable, diatomic molecule of Aluminum!
                        
                        This could have incredible implications for rocketry,\
                        as it is likely to exhibit more robust characteristics\
                        than standard Aluminum.  Great work!`
                    },
                    createdAt: "2020-03-24 17:27:30.000000-04",
                    projectId: "c14dcc7e-ca33-4824-89aa-d8da4d88fecb",
                    userId: "stevens-shibboleth_hgrainger5",
                },
                {
                    // welding image
                    id: "553011c6-13cc-4a65-8b7b-56ab1c49cac9",
                    document: {
                        type: "MEDIA",
                        mediaLink: "https://marqetplace-staging-photos.s3.amazonaws.com/projects/c14dcc7e-ca33-4824-89aa-d8da4d88fecb/board/10235bb0-2dc9-4a13-801b-3b729d096ce4"
                    },
                    createdAt: "2020-03-24 17:25:09.000000-04",
                    projectId: "c14dcc7e-ca33-4824-89aa-d8da4d88fecb",
                    userId: "stevens-shibboleth_kcote2"
                },
                {
                    id: "f8bb0444-138a-42ac-b95b-a5c952ec960e",
                    document: {
                        type: "TEXT",
                        body: `For our first laboratory demonstration, we had\
                        @stevens-shibboleth_dwynn14 perform a titration of\
                        hydrazine to show its improved stability properties.\
                        It was anything but basic!`
                    },
                    createdAt: "2020-03-18 11:21:20.000000-04",
                    projectId: "c14dcc7e-ca33-4824-89aa-d8da4d88fecb",
                    userId: "stevens-shibboleth_hgrainger5",
                },
                {
                    // lab image
                    id: "dfa7b4fa-d43e-462c-a0f9-24149cf21242",
                    document: {
                        type: "MEDIA",
                        mediaLink: "https://marqetplace-staging-photos.s3.amazonaws.com/projects/c14dcc7e-ca33-4824-89aa-d8da4d88fecb/board/8820cd25-4329-473c-a966-83d833b1a428"
                    },
                    createdAt: "2020-03-18 11:14:16.000000-04",
                    projectId: "c14dcc7e-ca33-4824-89aa-d8da4d88fecb",
                    userId: "stevens-shibboleth_hgrainger5"
                },
                {
                    id: "d598b120-3c75-4cd7-8890-32e52339df24",
                    document: {
                        type: "TEXT",
                        body: `Wow!  I cannot believe that we are living\
                        a launch as incredible as this!  If you have not seen\
                        this, you need to.`
                    },
                    createdAt: "2020-03-28 12:31:24.000000-04",
                    projectId: "c14dcc7e-ca33-4824-89aa-d8da4d88fecb",
                    userId: "stevens-shibboleth_hgrainger5",
                },
                {
                    // video
                    id: "163b3272-7de6-4c8d-82d4-807fcfc92914",
                    document: {
                        type: "MEDIA",
                        mediaLink: "https://marqetplace-staging-photos.s3.amazonaws.com/projects/c14dcc7e-ca33-4824-89aa-d8da4d88fecb/board/c87d56be-61ff-450f-bc03-0311873e07da",
                    },
                    createdAt: "2020-03-28 12:29:56.000000-04",
                    projectId: "c14dcc7e-ca33-4824-89aa-d8da4d88fecb",
                    userId: "stevens-shibboleth_dwynn14"
                }
			]);
		});
}
