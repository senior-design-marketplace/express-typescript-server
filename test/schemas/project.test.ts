describe('A project is', () => {
    const validate = require('../../src/schemas/build/project');

    test('not valid without a title or description', () => {
        const instance = {}
        expect(validate(instance)).toBe(false);
    });
    
    test('not valid with an empty title', () => {
        const instance = {
            title: '',
            body: 'test'
        }
        expect(validate(instance)).toBe(false);
    })
    
    test('valid with a title and body', () => {
        const instance = { 
            title: 'test',
            body: 'test'
         }
        expect(validate(instance)).toBe(true);
    });
})
