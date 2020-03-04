import validate from "../../src/schemas/build/QueryParams/QueryParams/validator";

describe("Query params for a project are", () => {

	test("not valid with two sorting options", () => {
		const instance = {
			sortBy: ["new", "popular"]
		};

		expect(validate(instance)).toBe(false);
	});

	test("not valid with an invalid sorting option", () => {
		const instance = {
			sortBy: "foo"
		};

		expect(validate(instance)).toBe(false);
	});

	test("not valid with an invalid tag", () => {
		const instance = {
			tag: "foo"
		};

		expect(validate(instance)).toBe(false);
	});

	test("not valid with an array of valid tags for one filter", () => {
		const instance = {
			tag: ["Computer Science", "Software Engineering"]
		};

		expect(validate(instance)).toBe(false);
	});

	test("not valid with an invalid order option", () => {
		const instance = {
			order: "foo"
		};

		expect(validate(instance)).toBe(false);
	});

	test("valid with an extraneous option", () => {
		const instance = {
			foo: "bar"
		};

		expect(validate(instance)).toBe(true);
	});

	test("valid with no options", () => {
		const instance = {};

		expect(validate(instance)).toBe(true);
	});

	test("valid with options", () => {
		const instance = {
			accepting_applications: "",
			has_advisor: "",
			sort_by: "new",
			tag: "Computer Science",
			order: "reverse",
			next: "foo"
		};

		expect(validate(instance)).toBe(true);
	});
});
