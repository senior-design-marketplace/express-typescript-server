describe("A project is", () => {
	const validate = require("../../src/schemas/build/project");

	test("not valid without a title or description", () => {
		const instance = {};
		expect(validate(instance)).toBe(false);
	});

	test("not valid with an empty title", () => {
		const instance = {
			title: "",
			tagline: "test"
		};
		expect(validate(instance)).toBe(false);
	});

	test("valid with a title and tagline", () => {
		const instance = {
			title: "test",
			tagline: "test"
		};
		expect(validate(instance)).toBe(true);
	});
});
