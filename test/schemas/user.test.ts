describe('A user is', () => {
    const validate = require('../../src/schemas/build/user');
    const validId = 'us-east-1:00000000-0000-0000-0000-000000000000';

    test('not valid without an id', () => {
        const instance = {};
        expect(validate(instance)).toBe(false);
    })
    
    test('not valid with a non-Cognito id', () => {
        const instance = {
            id: 'foo'
        }
        expect(validate(instance)).toBe(false);
    })
    
    test('not valid with anything surrounding a valid id', () => {
        const instance = {
            id: ' ' + validId + ' '
        }
        expect(validate(instance)).toBe(false);
    })
    
    test('not valid with multiple ids', () => {
        const instance = {
            id: validId.repeat(2)
        }
        expect(validate(instance)).toBe(false);
    })
    
    test('valid with a Cognito id', () => {
        const instance = {
            id: validId
        }
        expect(validate(instance)).toBe(true);
    })
})
