import AJV from 'ajv';

const comment = require('../../src/schemas/comment');
const user = require('../../src/schemas/user');

const ajv = new AJV();
ajv.addSchema(comment, 'comment');
ajv.addSchema([
    user
])

test('A comment without any content is not valid', () => {
    const instance = {}
    expect(ajv.validate('comment', instance)).toBe(false);
})

test('A comment with an empty body is not valid', () => {
    const instance = {
        body: ''
    }
    expect(ajv.validate('comment', instance)).toBe(false);
})

test('A comment with too much content is not valid', () => {
    const instance = {
        body: ' '.repeat(256 + 1)
    }
    expect(ajv.validate('comment', instance)).toBe(false);
})

test('A comment with content is valid', () => {
    const instance = { 
        body: 'test'
    }
    expect(ajv.validate('comment', instance)).toBe(true);
})