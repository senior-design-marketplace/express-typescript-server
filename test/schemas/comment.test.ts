describe('A comment is', () => {
    const validate = require('../../src/schemas/build/comment');

    test('not valid without any content', () => {
        const instance = {}
        expect(validate(instance)).toBe(false);
    })
    
    test('not valid with empty content', () => {
        const instance = {
            body: ''
        }
        expect(validate(instance)).toBe(false);
    })
    
    test('not valid with too much content', () => {
        const instance = {
            body: ' '.repeat(256 + 1)
        }
        expect(validate(instance)).toBe(false);
    })
    
    test('valid with a little content', () => {
        const instance = { 
            body: 'test'
        }
        expect(validate(instance)).toBe(true);
    })
})