import * as Knex from "knex";
import { getDefaultMediaLink } from "../../queries/util";

export async function seed(knex: Knex): Promise<any> {
	// Deletes ALL existing entries
	return knex("projects")
		.del()
		.then(async () => {
			return knex("projects").insert([
                {
                    id: "a427345d-5ef4-45cd-b5aa-cc601daeec73",
                    title: "Discovering Inconsistencies in Molecular Structure",
                    tagline: `Molecular structure can be exploited to uncover\
                    hidden insights.  We intend to find those insights.`,
                    body: `Under the guidance of Professors Wang and Rowlak,\
                    we have discovered new methods of using cosmic radiology\
                    to increase electric potential in solid wave forms.  The\
                    resulting equivalence can, in theory, be used to juxtapose\
                    modern systems with ancient technology.
                    
                    Through increased experimentation, we plan to discover the\
                    hidden meaning in these vibrations.  We predict that they\
                    have implications in acoustics, agriculture, and deep\
                    learning`,
                    acceptingApplications: false,
                    coverLink: getDefaultMediaLink(),
                    thumbnailLink: getDefaultMediaLink()
                },
                {
                    id: "06cf0c70-ff54-45d8-8ad9-1214b93a0431",
                    title: "First Look",
                    tagline: "Plan and Take Action",
                    body: `For our project, we are trying to create a program\
                    that will allow construction workers to visualize what\
                    needs to be done and alert them to problems that may occur\
                    during a build.  We want to make sure that our clients are\
                    able to see the problems before they occur.
                    
                    Using our software will be a game changer in decreasing\
                    problems int the workforce.  We strive to constantly create\
                    more and better software.`,
                    acceptingApplications: true,
                    coverLink: getDefaultMediaLink(),
                    thumbnailLink: getDefaultMediaLink()
                },
                {
                    id: "0ca8ee3c-29dd-4482-998c-c5c102c5bc92",
                    title: "SpaceCX",
                    tagline: "Explore with Ease",
                    body: `Our project plans to create a application that will\
                    allow for everyday users to look up at whatever events\
                    will be occuring in the sky tonight We love exploring\
                    and people love to see new constellations we hope that\
                    with our app we can allow users to explore the skies and\
                    see new stars, constellations, satellites, and many more\
                    galactic adventures that await to come.`,
                    acceptingApplications: false,
                    coverLink: getDefaultMediaLink(),
                    thumbnailLink: getDefaultMediaLink()
                },
                {
                    id: "5152a36e-0a71-4353-bac5-7b0a540268a7",
                    title: "Internal GQ",
                    tagline: `Learn and explore who you are on a much deeper\
                    level than before.`,
                    body: `Our project is based on allowing people to explore\
                    themselves.  We want to make it easy for anybody to pick up\
                    their phone and do a full body scan on their body. it is\
                    important for people to know  what's happening outside\
                    their body but definitely inside more.  The epidermis is\
                    the largest organ we have but many more lay underneath and\
                    our project will allow anybody to explore, learn, and\
                    manage their body better than ever before`,
                    acceptingApplications: true,
                    coverLink: getDefaultMediaLink(),
                    thumbnailLink: getDefaultMediaLink()
                },
                {
                    id: "68ccf170-8a98-46c1-b38e-30ba9b7ec259",
                    title: "Ashura",
                    tagline: "Know. Bet. Win.",
                    body: `Our project focuses on allowing people to finally\
                    understand how and when they should be placing bets on\
                    sports teams. Our project is going to focus on educating\
                    and allowing for the best user experience for betting. We\
                    plan on making a very easy to use and simplistic website\
                    where everyone that joins can easily make an educated bet\
                    and obviously win some money!`,
                    acceptingApplications: true,
                    coverLink: getDefaultMediaLink(),
                    thumbnailLink: getDefaultMediaLink()
                },
                {
                    id: "c14dcc7e-ca33-4824-89aa-d8da4d88fecb",
                    title: "Rocketry - CAP3",
                    tagline: "To the Stars!",
                    body: `Hi!  We are the CAP3 team.  We are working as part\
                    of the rocketry initiative on campus, alongside CPR.  Our\
                    fuel injection system, which is slated to be used in bay 3\
                    of the Chronos rocket launch, will be more secure,\
                    controlled, and powerful than ever before!
                    
                    The main injection system has to deal with two forms of\
                    liquid: hydrazine and benzene.  Our system goes through a\
                    critical series of checks to ensure that not only is the\
                    ratio of hydrazine to benzene stable, but that its feed\
                    into the control system is safe and monitored.
                    
                    If we are looking for applications, please feel free to\
                    submit one!  If not, please refrain from contacting the\
                    project advisors.`,
                    acceptingApplications: true,
                    coverLink: "https://marqetplace-staging-photos.s3.amazonaws.com/projects/c14dcc7e-ca33-4824-89aa-d8da4d88fecb/cover",
                    thumbnailLink: "https://marqetplace-staging-photos.s3.amazonaws.com/projects/c14dcc7e-ca33-4824-89aa-d8da4d88fecb/thumbnail"
                },
                {
                    id: "90353a1b-8051-4917-b4ed-dc7d89094da4",
                    title: "IConnectU",
                    tagline: "We connect you in the ICU.",
                    body: `We know how stressful it is to be a doctor\
                    performing in an intensive care unit.  Checking vitals,\
                    knowing what you need to do three steps from now, making\
                    sure everyone in the room has a direction.  When you are\
                    juggling all these variables, you can't even have time to\
                    do a simple math equation like 3 x 4.  It took our doctors\
                    40 seconds to answer this question.  He took even longer to\
                    organize his thoughts and make sure he knew what step he\
                    was at and what is coming up next.  With IConnect, we make\
                    these decisions for you so you don't have to.  We can walk\
                    surgeons through step by step while also keeping track of\
                    what's to come and better prepare you for the unknown of\
                    the ICU.`,
                    acceptingApplications: false,
                    coverLink: getDefaultMediaLink(),
                    thumbnailLink: getDefaultMediaLink()
                },
                {
                    id: "45129910-1936-4163-8ae4-d343a80a399d",
                    title: "Careful Systems",
                    tagline: "Organize, Recommend, Protect.",
                    body: `Our project plans to create and implement a system\
                    to better organize, store and recommend ways to\
                    treat patients. Millions of patients are treated everyday\
                    worldwide. If we had a way to store all that information\
                    and make a recommendation to a new patient based on\
                    all the other illnesses that have happened in the past\
                    based on symptoms alone that would revolutionize the world.\
                    We hope that our system will be leading the hospital\
                    industry in a matter of years because it's about time we\
                    stopped letting people not get the treatment they deserve\
                    and need.`,
                    acceptingApplications: true,
                    coverLink: getDefaultMediaLink(),
                    thumbnailLink: getDefaultMediaLink()
                },
                {
                    id: "940fdfd2-6efd-42f6-b612-e742f1e22a79",
                    title: "Float your Boat",
                    tagline: "Better Buoyancy, Better Results.",
                    body: `The Navy has thousands of boats. What if there was\
                    a way to make these boats lighter, faster, and stronger\
                    It almost sounds too good to be true. Well it is, but there\
                    is one boat, the cruiser tt564 that has to have this happen\
                    this boat is our most used travel and blockage boat\
                    this is what we use to handle pirates, blockades and high\
                    travel times to chase down other boats. Recently too\
                    many pirates have been damaging and escaping our\
                    boats. The Navy asked us to design a way to better design\
                    there crafts so they can chase down these pesky pirates`,
                    acceptingApplications: false,
                    coverLink: getDefaultMediaLink(),
                    thumbnailLink: getDefaultMediaLink()
                },
                {
                    id: "addf740c-1e67-4bc2-ad7f-2becdd6286cd",
                    title: "Perfect Pitch",
                    tagline: "Better Sounds, Precise Pitch.",
                    body: `Our project focuses on finding the perfect pitch for\
                    a note.  More often than you would think there are\
                    thousands of musicians that can not correctly find or use a\
                    pitch when they are creating music online. We plan to\
                    create a software that listens to their current song and\
                    gives them suggestions on which pitches or chords can be\
                    used later in the song. We plan on using advanced\
                    repetition identifying technology and see how the musicians\
                    like the recommendations or if it inspires them to create\
                    something new and beautiful.`,
                    acceptingApplications: false,
                    coverLink: getDefaultMediaLink(),
                    thumbnailLink: getDefaultMediaLink()                
                },
                {
                    id: "0257ef5f-d0fa-46a5-8307-ade638d479d8",
                    title: "Construct US",
                    tagline: "Making Sure you Trust What's Beneath You",
                    body: `Our project is to construct the new Benolvi Bridge\
                    This is a 700 ft bridge that is over another road.\
                    When creating a bridge there are many factors that\
                    you need to consider and make sure that they are\
                    not going to impact the bridge to the degree that it falls.\
                    Cars and trucks are heavy, the road creates a lot of heat,\
                    water below and create ware over time, etc. All these\
                    things need to be processed to make sure that our bridge\
                    will not fall.`,
                    acceptingApplications: true,
                    coverLink: getDefaultMediaLink(),
                    thumbnailLink: getDefaultMediaLink() 
                },
                {
                    id: "eef5a8e8-585e-4574-bc59-59d85b591390",
                    title: "First Step",
                    tagline: "Building Leaders of the Future",
                    body: `Our focus is the young leaders of tomorrow.\
                    It would be a amazing thing if all the leaders were\
                    trained, coached, brought up with the right decision\
                    making of a current CEO. We plan on making the\
                    leaders of the future even better than they already are.\
                    We will coach and educate them on how to handle tough\
                    situations, and steps they can take to better make these\
                    decisions. Leaders have a lot of stress on their shoulders\
                    let us help and take some of the load off.`,
                    acceptingApplications: true,
                    coverLink: getDefaultMediaLink(),
                    thumbnailLink: getDefaultMediaLink() 
                },
                {
                    id: "9f81645e-16db-444c-b2fd-49a5ae0a4713",
                    title: "Stonks",
                    tagline: "Invest Smarter, Relax Longer",
                    body: `Our mission is to make sure that in these\
                    uncertain times. People are still making strong\
                    investment decisions and making the most out of\
                    the market crashing. We plan on advancing people\
                    on their 401k decisions, their Roth, who to invest in\
                    Who is going to be tanking, seeing if housing is the right\
                    decision. The list goes on and on on ways to save your\
                    money and we want that decision to be easy for you. So\
                    don't work hard work smarter so you can live better later.`,
                    acceptingApplications: true,
                    coverLink: getDefaultMediaLink(),
                    thumbnailLink: getDefaultMediaLink() 
                },
                {
                    id: "5287bffc-a669-415f-9832-4211476c3544",
                    title: "Drive By",
                    tagline: "Be Productive While You Drive",
                    body: `Our project is focusing on taking self driving cars\
                    to the next level. No longer should we have to focus on\
                    driving. Millions of people die every day because of\
                    driving. Self driving cars can lower that number by almost\
                    99.9%. We will be focusing on making sure that your car can\
                    make accurate turns. We are using our cutting edge software\
                    and cameras to make sure that whenever a turn is coming up\
                    the car will be able to see it. analyze the situation and\
                    make sure that the car will be able to complete the turn\
                    as accurate and as safely as possible. Join Drive by and\
                    make sure that you no longer have to focus on driving.`,
                    acceptingApplications: true,
                    coverLink: getDefaultMediaLink(),
                    thumbnailLink: getDefaultMediaLink() 
                },
                {
                    id: "f4a80890-6aaf-4848-a4e2-08729d7d4c95",
                    title: "ConstaCircuits",
                    tagline: "Designing Smarter Circuits",
                    body: `If you didn't know constellations create amazing\
                    circuitry all by themselves. They are beautifully simple\
                    and some even create highly complex and ingenious circuits.\
                    Our project is going to holster these circuits and create\
                    powerful works of art with them. Our systems will make\
                    constellations be seenin your everyday software networks\
                    and machines.  These are simple to implement and they are\
                    sure to light up your electronics. This creative and new\
                    way of creating circuits that also complete their tasks\
                    will hopefully revolutionize the way we think about\
                    creating and displaying software.`,
                    acceptingApplications: false,
                    coverLink: getDefaultMediaLink(),
                    thumbnailLink: getDefaultMediaLink() 
                },
                {
                    id: "945285ee-e91c-4c56-8cee-0f21c160163b",
                    title: "GrowingLoud",
                    tagline: "Listen to your plants and let them listen to us.",
                    body: `If  you didn't know plants benefit immensely from\
                    being talked to.  They process the carbon monoxide faster\
                    and in turn grow faster.  We are proposing a system that\
                    will play music that will connect and bond with these\
                    plants to make them grow faster and stronger. Plants are\
                    living things. They deserve to hear the music that best\
                    suits them.  We have done hundreds of hours of research\
                    testing to see how plants respond to hearing music. The\
                    truth is if you connect to the plant and give them CO2,\
                    they will grow better than they ever have before. This is\
                    to ensure that these plants can reach their full potential.`,
                    acceptingApplications: false,
                    coverLink: getDefaultMediaLink(),
                    thumbnailLink: getDefaultMediaLink()
                }
			]);
		});
}
