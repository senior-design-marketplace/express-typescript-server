import validate from "../../src/schemas/build/project/projectMutable/validator";

describe("A project's mutable aspects are", () => {

	test("valid when empty", () => {
		const instance = {};
		expect(validate(instance)).toBe(true);
	});
});
