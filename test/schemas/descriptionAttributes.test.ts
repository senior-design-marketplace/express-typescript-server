describe('A description is', () => {
    const validate = require('../../src/schemas/build/descriptionAttributes');

    test('not valid without a title or body', () => {
        const instance = {}
        expect(validate(instance)).toBe(false);
    })
    
    test('not valid with an empty title or body', () => {
        const instance = {
            title: '',
            body: ''
        }
        expect(validate(instance)).toBe(false);
    })
    
    test('not valid with a title that is too long', () => {
        const instance = {
            title: ' '.repeat(256 + 1),
            body: 'test'
        }
        expect(validate(instance)).toBe(false);
    })
    
    test('valid with a short title and body', () => {
        const instance = {
            title: 'test',
            body: 'test'
        }
        expect(validate(instance)).toBe(true);
    })
})