describe('A tag is', () => {
    const validate = require('../../src/schemas/build/tag');

    test('not valid if empty', () => {
        const instance = '';
        expect(validate(instance)).toBe(false);
    })
    
    test('not valid if not allowed', () => {
        const instance = 'Foo';
        expect(validate(instance)).toBe(false);
    })
    
    test('valid if allowed', () => {
        const instance = 'Programming';
        expect(validate(instance)).toBe(true);
    })

    test('valid if a major', () => {
        const instance = 'Software Engineering';
        expect(validate(instance)).toBe(true);
    })
})
