import validate from "../../src/schemas/build/user/validator";

describe("A user is", () => {

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
