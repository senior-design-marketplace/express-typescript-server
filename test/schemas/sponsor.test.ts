describe('A sponsor is', () => {
    const validate = require('../../src/schemas/build/sponsor');

    test('not valid without a name', () => {
        const instance = {}
        expect(validate(instance)).toBe(false);
    })
    
    test('not valid with an empty name', () => {
        const instance = {
            name: ''
        }
        expect(validate(instance)).toBe(false);
    })
    
    test('not valid with too long a name', () => {
        const instance = {
            name: ' '.repeat(256 + 1)
        }
        expect(validate(instance)).toBe(false);
    })
    
    test('valid with a short name', () => {
        const instance = {
            name: 'test'
        };
        expect(validate(instance)).toBe(true);
    });
})
