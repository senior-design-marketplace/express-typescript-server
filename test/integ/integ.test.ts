import GatewayRunner from "./local";

// * the gateway runner is just a local copy of the gateway.
// * you can configure it to point to the staging db or a local
// * sqlite instance.  Keep in mind that running the postgres
// * instance will leave open handles and prevent Jest from
// * exiting.
const runner: GatewayRunner = new GatewayRunner();

afterAll(async () => {
	await runner.close();
});

test("Run a sample test", async () => {
	const response: any = await runner.runEvent({
		httpMethod: "GET",
		body: "",
		path: "/projects",
		queryStringParameters: {
			accepting_applications: null
		}
	});

	expect(response.statusCode).toBe(200);
});

test("Provide a request with bad query params", async () => {
	const response: any = await runner.runEvent({
		httpMethod: "GET",
		body: "",
		path: "/projects",
		queryStringParameters: {
			sort_by: "foo" // invalid sort parameter
		}
	});

	expect(response.statusCode).toBe(400);
});

test("Provide a boolean query parameter", async () => {
	const response = await runner.runEvent({
		httpMethod: "GET",
		body: "",
		path: "/projects",
		queryStringParameters: {
			has_advisor: null
		}
	});

	expect(response.statusCode).toBe(200);
});

test("Create a new project", async () => {
	const response: any = await runner.runEvent({
		httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: "00000000-0000-0000-0000-000000000000",
            title: "Unga bunga me make marqetplace bunga bunga",
            tagline: "Ong brother find shiny rock many year ago. He make it into cup. He drink from cup. Now Ong brother no think good. Ong think he no get enough magic potato juice, but other tribe man think it because of shiny cup. Why Ong brother dumb now?"
        }),
		path: "/projects",
		queryStringParameters: {}
	});

	expect(response.statusCode).toBe(200);
});

test("Get a specific project which does not exist", async () => {
	const response: any = await runner.runEvent({
		httpMethod: "GET",
		body: "",
		path: "/projects/ffffffff-ffff-ffff-ffff-ffffffffffff",
		queryStringParameters: {},
		requestContext: {}
	});

	expect(response.statusCode).toBe(404);
});
