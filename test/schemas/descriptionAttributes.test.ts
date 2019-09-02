import AJV from 'ajv';

const descriptionAttributes = require('../../src/schemas/descriptionAttributes');
const tag = require('../../src/schemas/tag')

const ajv = new AJV();
ajv.addSchema(descriptionAttributes, 'descriptionAttributes')
ajv.addSchema([
    tag
])

test('A description without a title or body is not valid', () => {
    const instance = {}
    expect(ajv.validate('descriptionAttributes', instance)).toBe(false);
})

test('An empty title or body is not valid', () => {
    const instance = {
        title: '',
        body: ''
    }
    expect(ajv.validate('descriptionAttributes', instance)).toBe(false);
})

test('A title that is too long is not valid', () => {
    const instance = {
        title: ' '.repeat(256 + 1),
        body: 'test'
    }
    expect(ajv.validate('descriptionAttributes', instance)).toBe(false);
})

test('A description with a title and body is valid', () => {
    const instance = {
        title: 'test',
        body: 'test'
    }
    expect(ajv.validate('descriptionAttributes', instance)).toBe(true);
})