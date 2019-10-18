describe("A user is", () => {
	const validate = require("../../src/schemas/build/user");

	test("not valid without an id", () => {
		const instance = {};
		expect(validate(instance)).toBe(false);
	});

	test("valid with an id", () => {
		const instance = {
			id: "foo"
		};
		expect(validate(instance)).toBe(true);
	});
});
