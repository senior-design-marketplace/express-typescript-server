import validate from "../../src/schemas/build/validators/project";

describe("A project is", () => {

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
