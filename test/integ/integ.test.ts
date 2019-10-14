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

test("Provide a bad reqest", async () => {
	const response: any = await runner.runEvent({
		httpMethod: "POST",
		body: "", // invalid body
		path: "/projects",
		queryStringParameters: {}
	});

	expect(response.statusCode).toBe(400);
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
