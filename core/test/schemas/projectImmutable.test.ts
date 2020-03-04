import validate from "../../src/schemas/build/Project/ProjectImmutable/validator";

describe("A project's immutable aspects are", () => {

	test("not valid without a required attributes", () => {
		const instance = {};
		expect(validate(instance)).toBe(false);
	});
    
    test("valid with an id", () => {
        const instance = {
            id: "00000000-0000-0000-0000-000000000000",
			title: "test",
			tagline: "test"
		};
        expect(validate(instance)).toBe(true);
    })
});
