import AJV from 'ajv';

const tag = require('../../src/schemas/tag')

const ajv = new AJV();
ajv.addSchema(tag, 'tag');

test('An empty tag is not valid', () => {
    const instance = '';
    expect(ajv.validate('tag', instance)).toBe(false);
})

test('Any non-allowed tag is not valid', () => {
    const instance = 'Foo';
    expect(ajv.validate('tag', instance)).toBe(false);
})

test('One of the allowed tags is valid', () => {
    const instance = 'Programming';
    expect(ajv.validate('tag', instance)).toBe(true);
})
