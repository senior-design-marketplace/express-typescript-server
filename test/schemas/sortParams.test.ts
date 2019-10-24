import validate from "../../src/schemas/build/sortParams/validator";

describe("Sort params for a project are", () => {

	test("not valid with two sorting options", () => {
		const instance = {
			sort_by: ["new", "popular"]
		};

		expect(validate(instance)).toBe(false);
	});

	test("not valid with an invalid sorting option", () => {
		const instance = {
			sort_by: "foo"
		};

		expect(validate(instance)).toBe(false);
	});

	test("not valid with an invalid order option", () => {
		const instance = {
			order: "foo"
		};

		expect(validate(instance)).toBe(false);
	});

	test("valid with no options", () => {
		const instance = {};

		expect(validate(instance)).toBe(true);
	});

	test("valid with options", () => {
		const instance = {
			sort_by: "new",
			order: "reverse",
			next: "foo"
		};

		expect(validate(instance)).toBe(true);
	});
});
