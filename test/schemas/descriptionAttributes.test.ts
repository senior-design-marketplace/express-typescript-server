describe('A description is', () => {
    const validate = require('../../src/schemas/build/descriptionAttributes');

    test('valid when empty', () => {
        const instance = {}
        expect(validate(instance)).toBe(true);
    })
})