describe('A project is', () => {
    const validate = require('../../src/schemas/build/project');

    test('not valid without a name or description', () => {
        const instance = {}
        expect(validate(instance)).toBe(false);
    });
    
    test('not valid with an empty name', () => {
        const instance = {
            name: '',
            descriptionAttributes: {
                title: 'test',
                body: 'body'
            }
        }
        expect(validate(instance)).toBe(false);
    })
    
    test('not valid with too high of a difficulty', () => {
        const instance = {
            name: 'test',
            descriptionAttributes: {
                title: 'test',
                body: 'test'
            },
            difficulty: 10.0 + 1
        }
        expect(validate(instance)).toBe(false);
    })
    
    test('not valid with too low of a difficulty', () => {
        const instance = {
            name: 'test',
            descriptionAttributes: {
                title: 'test',
                body: 'test'
            },
            difficulty: 0.0
        }
        expect(validate(instance)).toBe(false);
    })
    
    test('valid with a name and description', () => {
        const instance = { 
            name: 'test',
            descriptionAttributes: {
                title: 'test',
                body: 'test'
            }
         }
        expect(validate(instance)).toBe(true);
    });
})
