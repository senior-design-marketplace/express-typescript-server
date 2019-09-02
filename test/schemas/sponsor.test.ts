import AJV from 'ajv';

const sponsor = require('../../src/schemas/sponsor')

const ajv = new AJV();
ajv.addSchema(sponsor, 'sponsor');

test('A sponsor without a name is not valid', () => {
    const instance = {}
    expect(ajv.validate('sponsor', instance)).toBe(false);
})

test('A sponsor with an empty name is not valid', () => {
    const instance = {
        name: ''
    }
    expect(ajv.validate('sponsor', instance)).toBe(false);
})

test('A sponsor with too long a name is not valid', () => {
    const instance = {
        name: ' '.repeat(256 + 1)
    }
    expect(ajv.validate('sponsor', instance)).toBe(false);
})

test('A sponsor with a name is valid', () => {
    const instance = {
        name: 'test'
    };
    expect(ajv.validate('sponsor', instance)).toBe(true);
});