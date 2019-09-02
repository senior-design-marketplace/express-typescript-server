import AJV from 'ajv';

const comment = require('../../src/schemas/comment');
const descriptionAttributes = require('../../src/schemas/descriptionAttributes');
const project = require('../../src/schemas/project');
const sponsor = require('../../src/schemas/sponsor');
const tag = require('../../src/schemas/tag')
const user = require('../../src/schemas/user');

const ajv = new AJV();
ajv.addSchema(project, 'project')
ajv.addSchema([
    comment,
    descriptionAttributes,
    sponsor,
    tag,
    user
])

test('A project without a name or description is not valid', () => {
    const instance = {}
    expect(ajv.validate('project', instance)).toBe(false);
});

test('A project with an empty name is not valid', () => {
    const instance = {
        name: '',
        descriptionAttributes: {
            title: 'test',
            body: 'body'
        }
    }
    expect(ajv.validate('project', instance)).toBe(false);
})

test('Too high of a difficulty is not valid', () => {
    const instance = {
        name: 'test',
        descriptionAttributes: {
            title: 'test',
            body: 'test'
        },
        difficulty: 10.0 + 1
    }
    expect(ajv.validate('project', instance)).toBe(false);
})

test('Too low of a difficulty is not valid', () => {
    const instance = {
        name: 'test',
        descriptionAttributes: {
            title: 'test',
            body: 'test'
        },
        difficulty: 0.0
    }
    expect(ajv.validate('project', instance)).toBe(false);
})

test('A project with a name and description is valid', () => {
    const instance = { 
        name: 'test',
        descriptionAttributes: {
            title: 'test',
            body: 'test'
        }
     }
    expect(ajv.validate('project', instance)).toBe(true);
});
