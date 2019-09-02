import AJV from 'ajv';

const user = require('../../src/schemas/user')

const ajv = new AJV();
ajv.addSchema(user, 'user');

const validId = 'us-east-1:00000000-0000-0000-0000-000000000000';

test('A user without an id is not valid', () => {
    const instance = {};
    expect(ajv.validate('user', instance)).toBe(false);
})

test('A user with a non-Cognito id is not valid', () => {
    const instance = {
        id: 'foo'
    }
    expect(ajv.validate('user', instance)).toBe(false);
})

test('Anything surrounding a valid id makes it invalid', () => {
    const instance = {
        id: ' ' + validId + ' '
    }
    expect(ajv.validate('user', instance)).toBe(false);
})

test('Multiple ids are invalid', () => {
    const instance = {
        id: validId.repeat(2)
    }
    expect(ajv.validate('user', instance)).toBe(false);
})

test('A user with a Cognito id is valid', () => {
    const instance = {
        id: validId
    }
    expect(ajv.validate('user', instance)).toBe(true);
})