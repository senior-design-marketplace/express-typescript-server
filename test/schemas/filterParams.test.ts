describe("Filter params for a project are", () => {
	const validate = require("../../src/schemas/build/filterParams");

	test("not valid with an invalid tag", () => {
		const instance = {
			tag: "foo"
		};

		expect(validate(instance)).toBe(false);
	});

	test("not valid with an array of valid tags", () => {
		const instance = {
			tag: ["Computer Science", "Software Engineering"]
		};

		expect(validate(instance)).toBe(false);
	});

	test("valid with no options", () => {
		const instance = {};

		expect(validate(instance)).toBe(true);
	});

	test("valid with options", () => {
		const instance = {
			tag: "Computer Science",
			advisor_id: "d8a46313-dcb4-44f6-8bff-bd532b5c2c80",
			requested_major: "Software Engineering"
		};

		expect(validate(instance)).toBe(true);
	});
});
